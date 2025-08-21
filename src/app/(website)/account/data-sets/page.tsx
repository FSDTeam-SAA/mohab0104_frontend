"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { X, Loader2, Calendar, Hash, Type, ToggleLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { fetchUserDataSet } from "@/lib/api";

interface DataSet {
  _id: string;
  userId: {
    _id: string;
    companyName?: string;
  };
  dataSets: string;
  dataSetName: string;
  createdAt: string;
}

interface DataPoint {
  [key: string]: string | number | boolean | null | undefined;
}

interface ChartData {
  lineChart: { x: string; y: number }[];
  pieChart: { name: string; value: number; color: string }[];
  metrics: Record<string, number>;
  categories: string[];
}

interface FieldInfo {
  name: string;
  type: "string" | "number" | "date" | "boolean";
  values: (string | number | boolean)[];
  min?: number;
  max?: number;
  uniqueCount: number;
}

interface FilterState {
  dateRange?: string;
  numericRanges: Record<string, { min?: number; max?: number }>;
  categoricalSelections: Record<string, string[]>;
  booleanSelections: Record<string, boolean | null>;
  textSearch: string;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF7C7C",
];

export default function DynamicUserDashboard() {
  const [dataSets, setDataSets] = useState<DataSet[]>([]);
  const [selectedDataSet, setSelectedDataSet] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [rawData, setRawData] = useState<DataPoint[]>([]);
  const [filteredData, setFilteredData] = useState<DataPoint[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    lineChart: [],
    pieChart: [],
    metrics: {},
    categories: [],
  });
  const [availableFields, setAvailableFields] = useState<FieldInfo[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    numericRanges: {},
    categoricalSelections: {},
    booleanSelections: {},
    textSearch: "",
  });
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fieldsByType = useMemo(() => {
    const numeric = availableFields.filter((f) => f.type === "number");
    const categorical = availableFields.filter(
      (f) => f.type === "string" && f.uniqueCount > 1 && f.uniqueCount <= 20
    );
    const boolean = availableFields.filter((f) => f.type === "boolean");
    const date = availableFields.filter((f) => f.type === "date");
    const text = availableFields.filter(
      (f) => f.type === "string" && f.uniqueCount > 20
    );

    return { numeric, categorical, boolean, date, text };
  }, [availableFields]);

  // Load datasets on component mount
  useEffect(() => {
    loadUserDataSets();
  }, []);

  // Load dataset content when selection changes
  useEffect(() => {
    if (selectedDataSet) {
      loadDataSetContent();
    }
  }, [selectedDataSet]);

  // Apply filters when data or filters change
  useEffect(() => {
    if (rawData.length > 0) {
      applyFilters();
    }
  }, [rawData, filters, selectedMetrics, selectedDimensions]);

  const loadUserDataSets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchUserDataSet(1, 50);

      if (response.success && response.data) {
        setDataSets(response.data);
        if (response.data.length > 0) {
          setSelectedDataSet(response.data[0]._id);
        }
      } else {
        setError(response.error || "Failed to load datasets");
      }
    } catch (error) {
      console.error("Error loading user datasets:", error);
      setError("Error loading datasets");
    } finally {
      setLoading(false);
    }
  };

  const loadDataSetContent = async () => {
    const selectedDataSetObj = dataSets.find(
      (ds) => ds._id === selectedDataSet
    );
    if (!selectedDataSetObj) return;

    try {
      setDataLoading(true);
      setError(null);

      let jsonData;

      if (
        selectedDataSetObj.dataSets.startsWith("data:application/json;base64,")
      ) {
        // Handle base64 encoded JSON
        const base64Data = selectedDataSetObj.dataSets.split(",")[1];
        const jsonString = atob(base64Data);
        jsonData = JSON.parse(jsonString);
      } else if (selectedDataSetObj.dataSets.startsWith("http")) {
        // Handle URL data sources
        const response = await fetch(selectedDataSetObj.dataSets);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch data: ${response.status} ${response.statusText}`
          );
        }

        const responseText = await response.text();

        // Try to parse as regular JSON first
        try {
          jsonData = JSON.parse(responseText);
        } catch {
          // If that fails, try parsing as JSONL (JSON Lines format)
          try {
            const lines = responseText
              .trim()
              .split("\n")
              .filter((line) => line.trim());
            jsonData = lines.map((line) => JSON.parse(line));
          } catch {
            throw new Error(
              "Invalid JSON format: expected JSON or JSONL format"
            );
          }
        }
      } else {
        // Handle direct JSON string or JSONL string
        try {
          jsonData = JSON.parse(selectedDataSetObj.dataSets);
        } catch {
          // Try parsing as JSONL format
          try {
            const lines = selectedDataSetObj.dataSets
              .trim()
              .split("\n")
              .filter((line) => line.trim());
            jsonData = lines.map((line) => JSON.parse(line));
          } catch {
            throw new Error("Invalid JSON format in dataset");
          }
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const flattenObject = (obj: any, prefix = ""): any => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const flattened: any = {};

        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const newKey = prefix ? `${prefix}.${key}` : key;

            if (
              obj[key] !== null &&
              typeof obj[key] === "object" &&
              !Array.isArray(obj[key])
            ) {
              // Recursively flatten nested objects
              Object.assign(flattened, flattenObject(obj[key], newKey));
            } else if (Array.isArray(obj[key])) {
              // Handle arrays by taking the first element if it's an object
              if (obj[key].length > 0 && typeof obj[key][0] === "object") {
                Object.assign(flattened, flattenObject(obj[key][0], newKey));
              } else {
                flattened[newKey] = obj[key];
              }
            } else {
              flattened[newKey] = obj[key];
            }
          }
        }

        return flattened;
      };

      if (!Array.isArray(jsonData)) {
        if (typeof jsonData === "object" && jsonData !== null) {
          jsonData = [jsonData]; // Convert single object to array
        } else {
          throw new Error("Invalid data format: expected object or array");
        }
      }

      if (jsonData.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jsonData = jsonData.map((item: any) => {
          if (typeof item === "object" && item !== null) {
            return flattenObject(item);
          }
          return item;
        });
      }

      if (jsonData.length === 0) {
        setRawData([]);
        setAvailableFields([]);
        setError(null); // No error for empty data
        return;
      }

      setRawData(jsonData);
      analyzeDataStructure(jsonData);
      resetFilters();
    } catch (error) {
      console.error("Error loading dataset content:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load dataset content"
      );
      setRawData([]);
      setAvailableFields([]);
    } finally {
      setDataLoading(false);
    }
  };

  const analyzeDataStructure = useCallback((data: DataPoint[]) => {
    if (data.length === 0) {
      setAvailableFields([]);
      return;
    }

    const fields: FieldInfo[] = [];
    const sampleSize = Math.min(100, data.length);
    const sampleData = data.slice(0, sampleSize);

    Object.keys(data[0]).forEach((key) => {
      const values = sampleData
        .map((item) => item[key])
        .filter(
          (val): val is string | number | boolean =>
            val !== null && val !== undefined
        );

      if (values.length === 0) return;

      if (isIdField(key)) {
        return;
      }

      const uniqueValues = [...new Set(values)];
      let type: FieldInfo["type"] = "string";
      let min: number | undefined;
      let max: number | undefined;

      // Enhanced type detection
      if (values.every((val) => typeof val === "number")) {
        type = "number";
        const numericValues = values as number[];
        min = Math.min(...numericValues);
        max = Math.max(...numericValues);
      } else if (values.every((val) => typeof val === "boolean")) {
        type = "boolean";
      } else if (isDateField(key, values)) {
        type = "date";
      } else if (isNumericString(values)) {
        type = "number";
        const numericValues = values
          .map((v) => Number.parseFloat(String(v)))
          .filter((v) => !isNaN(v));
        if (numericValues.length > 0) {
          min = Math.min(...numericValues);
          max = Math.max(...numericValues);
        }
      }

      fields.push({
        name: key,
        type,
        values: uniqueValues.slice(0, 50),
        min,
        max,
        uniqueCount: uniqueValues.length,
      });
    });

    setAvailableFields(fields);

    // Auto-select initial metrics and dimensions
    const numericFields = fields.filter((f) => f.type === "number");
    const categoricalFields = fields.filter(
      (f) => f.type === "string" && f.uniqueCount > 1 && f.uniqueCount <= 20
    );

    if (numericFields.length > 0) {
      setSelectedMetrics([numericFields[0].name]);
    }

    if (categoricalFields.length > 0) {
      setSelectedDimensions([categoricalFields[0].name]);
    }
  }, []);

  const isDateField = (
    fieldName: string,
    values: (string | number | boolean)[]
  ): boolean => {
    const dateKeywords = ["date", "time", "created", "updated", "timestamp"];
    const hasDateKeyword = dateKeywords.some((keyword) =>
      fieldName.toLowerCase().includes(keyword)
    );

    if (hasDateKeyword) return true;

    const stringValues = values.filter(
      (v) => typeof v === "string"
    ) as string[];
    if (stringValues.length === 0) return false;

    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}/,
      /^\d{2}\/\d{2}\/\d{4}/,
      /^\d{2}-\d{2}-\d{4}/,
      /^\d{4}\/\d{2}\/\d{2}/,
    ];

    const sampleValues = stringValues.slice(0, 10);
    const dateMatches = sampleValues.filter(
      (val) =>
        datePatterns.some((pattern) => pattern.test(val)) &&
        !isNaN(Date.parse(val))
    );

    return dateMatches.length / sampleValues.length > 0.7;
  };

  const isNumericString = (values: (string | number | boolean)[]): boolean => {
    const stringValues = values.filter(
      (v) => typeof v === "string"
    ) as string[];
    if (stringValues.length === 0) return false;

    const numericCount = stringValues.filter(
      (val) =>
        !isNaN(Number.parseFloat(val)) && isFinite(Number.parseFloat(val))
    ).length;

    return numericCount / stringValues.length > 0.8;
  };

  const isIdField = (fieldName: string): boolean => {
    const idPatterns = [
      /^_?id$/i, // id, _id, ID, _ID
      /^.*_id$/i, // user_id, product_id, etc.
      /^.*Id$/, // userId, productId, etc.
      /^uuid$/i, // uuid, UUID
      /^guid$/i, // guid, GUID
      /^.*_uuid$/i, // user_uuid, etc.
      /^.*Uuid$/, // userUuid, etc.
      /^key$/i, // key, KEY
      /^.*_key$/i, // user_key, etc.
      /^.*Key$/, // userKey, etc.
    ];

    return idPatterns.some((pattern) => pattern.test(fieldName));
  };

  const resetFilters = () => {
    setFilters({
      numericRanges: {},
      categoricalSelections: {},
      booleanSelections: {},
      textSearch: "",
    });
  };

  const applyFilters = useCallback(() => {
    let filtered = [...rawData];

    // Apply text search across all string fields
    if (filters.textSearch.trim()) {
      const searchTerm = filters.textSearch.toLowerCase();
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm)
        )
      );
    }

    // Apply numeric range filters
    Object.entries(filters.numericRanges).forEach(([field, range]) => {
      if (range.min !== undefined || range.max !== undefined) {
        filtered = filtered.filter((item) => {
          const value = Number(item[field]);
          if (isNaN(value)) return false;

          if (range.min !== undefined && value < range.min) return false;
          if (range.max !== undefined && value > range.max) return false;
          return true;
        });
      }
    });

    // Apply categorical filters
    Object.entries(filters.categoricalSelections).forEach(
      ([field, selectedValues]) => {
        if (selectedValues.length > 0) {
          filtered = filtered.filter((item) =>
            selectedValues.includes(String(item[field]))
          );
        }
      }
    );

    // Apply boolean filters
    Object.entries(filters.booleanSelections).forEach(
      ([field, selectedValue]) => {
        if (selectedValue !== null) {
          filtered = filtered.filter((item) => {
            const value = item[field];
            if (typeof value === "boolean") return value === selectedValue;
            if (typeof value === "string") {
              const boolValue =
                value.toLowerCase() === "true" || value.toLowerCase() === "yes";
              return boolValue === selectedValue;
            }
            return false;
          });
        }
      }
    );

    // Apply date range filter
    if (filters.dateRange && fieldsByType.date.length > 0) {
      const dateField = fieldsByType.date[0].name;
      const now = new Date();
      const startDate = new Date();

      switch (filters.dateRange) {
        case "last-7-days":
          startDate.setDate(now.getDate() - 7);
          break;
        case "last-30-days":
          startDate.setDate(now.getDate() - 30);
          break;
        case "last-90-days":
          startDate.setDate(now.getDate() - 90);
          break;
        case "last-year":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter((item) => {
        const itemDate = new Date(String(item[dateField]));
        return itemDate >= startDate && itemDate <= now;
      });
    }

    setFilteredData(filtered);
    generateChartData(filtered);
    // eslint-disable-next-line
  }, [rawData, filters, fieldsByType.date]);

  const generateChartData = useCallback(
    (data: DataPoint[]) => {
      if (data.length === 0 || selectedMetrics.length === 0) {
        setChartData({
          lineChart: [],
          pieChart: [],
          metrics: {},
          categories: [],
        });
        return;
      }

      const newChartData: ChartData = {
        lineChart: [],
        pieChart: [],
        metrics: {},
        categories: [],
      };

      // Generate metrics
      selectedMetrics.forEach((metric) => {
        const values = data.map((item) => {
          const value = item[metric];
          return typeof value === "number"
            ? value
            : Number.parseFloat(String(value)) || 0;
        });
        newChartData.metrics[metric] = values.reduce(
          (sum, val) => sum + val,
          0
        );
      });

      // Generate line chart data
      const dateField = fieldsByType.date[0]?.name;
      const primaryMetric = selectedMetrics[0];

      if (primaryMetric) {
        if (dateField) {
          const groupedByDate = data.reduce((acc, item) => {
            const dateValue = item[dateField];
            if (!dateValue) return acc;

            const date = new Date(String(dateValue)).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
              }
            );

            if (typeof acc[date] !== "number") acc[date] = 0;
            const metricValue = item[primaryMetric];
            acc[date] +=
              typeof metricValue === "number"
                ? metricValue
                : Number.parseFloat(String(metricValue)) || 0;
            return acc;
          }, {} as Record<string, number>);

          const sortedEntries = Object.entries(groupedByDate).sort(
            ([a], [b]) => {
              return new Date(a).getTime() - new Date(b).getTime();
            }
          );

          newChartData.lineChart = sortedEntries.map(([date, value]) => ({
            x: date,
            y: Number(value),
          }));
        } else {
          newChartData.lineChart = data.slice(0, 20).map((item, index) => ({
            x: `P${index + 1}`,
            y:
              typeof item[primaryMetric] === "number"
                ? item[primaryMetric]
                : Number.parseFloat(String(item[primaryMetric])) || 0,
          }));
        }
      }

      // Generate pie chart data
      const primaryDimension = selectedDimensions[0];
      if (primaryDimension && primaryMetric) {
        const groupedByDimension = data.reduce((acc, item) => {
          const dimensionValue = item[primaryDimension];
          const dimension = String(dimensionValue || "Unknown");

          if (typeof acc[dimension] !== "number") acc[dimension] = 0;
          const metricValue = item[primaryMetric];
          acc[dimension] +=
            typeof metricValue === "number"
              ? metricValue
              : Number.parseFloat(String(metricValue)) || 0;
          return acc;
        }, {} as Record<string, number>);

        newChartData.pieChart = Object.entries(groupedByDimension)
          .sort(([, a], [, b]) => (Number(b ?? 0) - Number(a ?? 0)))
          .slice(0, 8)
          .map(([name, value], index) => ({
            name,
            value: Number(value),
            color: COLORS[index % COLORS.length],
          }));
      }

      setChartData(newChartData);
    },
    [selectedMetrics, selectedDimensions, fieldsByType]
  );

  const updateNumericFilter = (
    field: string,
    type: "min" | "max",
    value: string
  ) => {
    const numValue = value === "" ? undefined : Number.parseFloat(value);
    setFilters((prev) => ({
      ...prev,
      numericRanges: {
        ...prev.numericRanges,
        [field]: {
          ...prev.numericRanges[field],
          [type]: numValue,
        },
      },
    }));
  };

  const updateCategoricalFilter = (field: string, values: string[]) => {
    setFilters((prev) => ({
      ...prev,
      categoricalSelections: {
        ...prev.categoricalSelections,
        [field]: values,
      },
    }));
  };

  const updateBooleanFilter = (field: string, value: boolean | null) => {
    setFilters((prev) => ({
      ...prev,
      booleanSelections: {
        ...prev.booleanSelections,
        [field]: value,
      },
    }));
  };

  const removeMetric = useCallback((metric: string) => {
    setSelectedMetrics((prev) => prev.filter((m) => m !== metric));
  }, []);

  const removeDimension = useCallback((dimension: string) => {
    setSelectedDimensions((prev) => prev.filter((d) => d !== dimension));
  }, []);

  const addMetric = useCallback(
    (metric: string) => {
      if (!selectedMetrics.includes(metric)) {
        setSelectedMetrics((prev) => [...prev, metric]);
      }
    },
    [selectedMetrics]
  );

  const addDimension = useCallback(
    (dimension: string) => {
      if (!selectedDimensions.includes(dimension)) {
        setSelectedDimensions((prev) => [...prev, dimension]);
      }
    },
    [selectedDimensions]
  );

  const handleDataSetChange = useCallback((dataSetId: string) => {
    setSelectedDataSet(dataSetId);
    setSelectedMetrics([]);
    setSelectedDimensions([]);
    setRawData([]);
    setFilteredData([]);
    setChartData({
      lineChart: [],
      pieChart: [],
      metrics: {},
      categories: [],
    });
    resetFilters();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading datasets...</p>
        </div>
      </div>
    );
  }

  if (error && dataSets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadUserDataSets}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (dataSets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold mb-2">No Data Sets Available</h2>
            <p className="text-gray-600 mb-4">
              You don&apos;t have any datasets yet. Upload a dataset or provide
              a URL to JSON data to get started.
            </p>
            <Button onClick={loadUserDataSets}>Refresh</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedDataSet && rawData.length === 0 && !dataLoading && !error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">📈</div>
            <h2 className="text-2xl font-bold mb-2">No Data Available</h2>
            <p className="text-gray-600 mb-4">
              The selected dataset appears to be empty or contains no valid
              data.
            </p>
            <Button onClick={loadDataSetContent}>Reload Data</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Enhanced Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Dataset Filter */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Dataset
                  </Label>
                  <Select
                    value={selectedDataSet}
                    onValueChange={handleDataSetChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Dataset" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataSets.map((dataSet) => (
                        <SelectItem key={dataSet._id} value={dataSet._id}>
                          {dataSet.dataSetName || "Dataset"} -{" "}
                          {new Date(dataSet.createdAt).toLocaleDateString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {availableFields.length > 0 && (
                  <>
                    <div>
                      <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Type className="w-4 h-4" />
                        Search All Fields
                      </Label>
                      <Input
                        placeholder="Search across all data..."
                        value={filters.textSearch}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            textSearch: e.target.value,
                          }))
                        }
                      />
                    </div>

                    {fieldsByType.date.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date Range ({fieldsByType.date[0].name})
                        </Label>
                        <Select
                          value={filters.dateRange || "all-time"}
                          onValueChange={(value) =>
                            setFilters((prev) => ({
                              ...prev,
                              dateRange: value || undefined,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Date Range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all-time">All Time</SelectItem>
                            <SelectItem value="last-7-days">
                              Last 7 days
                            </SelectItem>
                            <SelectItem value="last-30-days">
                              Last 30 days
                            </SelectItem>
                            <SelectItem value="last-90-days">
                              Last 90 days
                            </SelectItem>
                            <SelectItem value="last-year">Last year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {fieldsByType.numeric.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          Numeric Ranges
                        </Label>
                        <div className="space-y-3">
                          {fieldsByType.numeric.map((field) => (
                            <div key={field.name} className="space-y-2">
                              <Label className="text-xs text-gray-600">
                                {field.name}
                              </Label>
                              <div className="flex gap-2">
                                <Input
                                  placeholder={`Min (${field.min})`}
                                  type="number"
                                  value={
                                    filters.numericRanges[field.name]?.min ?? ""
                                  }
                                  onChange={(e) =>
                                    updateNumericFilter(
                                      field.name,
                                      "min",
                                      e.target.value
                                    )
                                  }
                                  className="text-xs"
                                />
                                <Input
                                  placeholder={`Max (${field.max})`}
                                  type="number"
                                  value={
                                    filters.numericRanges[field.name]?.max ?? ""
                                  }
                                  onChange={(e) =>
                                    updateNumericFilter(
                                      field.name,
                                      "max",
                                      e.target.value
                                    )
                                  }
                                  className="text-xs"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {fieldsByType.categorical.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          Categories
                        </Label>
                        <div className="space-y-3">
                          {fieldsByType.categorical.map((field) => (
                            <div key={field.name} className="space-y-2">
                              <Label className="text-xs text-gray-600">
                                {field.name}
                              </Label>
                              <div className="max-h-32 overflow-y-auto space-y-1">
                                {field.values.map((value) => (
                                  <div
                                    key={String(value)}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={`${field.name}-${value}`}
                                      checked={
                                        filters.categoricalSelections[
                                          field.name
                                        ]?.includes(String(value)) || false
                                      }
                                      onCheckedChange={(checked) => {
                                        const current =
                                          filters.categoricalSelections[
                                            field.name
                                          ] || [];
                                        const updated = checked
                                          ? [...current, String(value)]
                                          : current.filter(
                                              (v) => v !== String(value)
                                            );
                                        updateCategoricalFilter(
                                          field.name,
                                          updated
                                        );
                                      }}
                                    />
                                    <Label
                                      htmlFor={`${field.name}-${value}`}
                                      className="text-xs"
                                    >
                                      {String(value)}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {fieldsByType.boolean.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                          <ToggleLeft className="w-4 h-4" />
                          Boolean Fields
                        </Label>
                        <div className="space-y-2">
                          {fieldsByType.boolean.map((field) => (
                            <div key={field.name} className="space-y-1">
                              <Label className="text-xs text-gray-600">
                                {field.name}
                              </Label>
                              <Select
                                value={
                                  filters.booleanSelections[field.name] === null
                                    ? "all"
                                    : filters.booleanSelections[field.name]
                                    ? "true"
                                    : "false"
                                }
                                onValueChange={(value) => {
                                  const boolValue =
                                    value === "all" ? null : value === "true";
                                  updateBooleanFilter(field.name, boolValue);
                                }}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All</SelectItem>
                                  <SelectItem value="true">True</SelectItem>
                                  <SelectItem value="false">False</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {fieldsByType.numeric.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          Metrics
                        </Label>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {selectedMetrics.map((metric) => (
                              <Badge
                                key={metric}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {metric}
                                <X
                                  className="w-3 h-3 cursor-pointer"
                                  onClick={() => removeMetric(metric)}
                                />
                              </Badge>
                            ))}
                          </div>
                          <Select onValueChange={addMetric}>
                            <SelectTrigger>
                              <SelectValue placeholder="Add metric" />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldsByType.numeric
                                .filter(
                                  (field) =>
                                    !selectedMetrics.includes(field.name)
                                )
                                .map((field) => (
                                  <SelectItem
                                    key={field.name}
                                    value={field.name}
                                  >
                                    {field.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {fieldsByType.categorical.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          Dimensions
                        </Label>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {selectedDimensions.map((dimension) => (
                              <Badge
                                key={dimension}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {dimension}
                                <X
                                  className="w-3 h-3 cursor-pointer"
                                  onClick={() => removeDimension(dimension)}
                                />
                              </Badge>
                            ))}
                          </div>
                          <Select onValueChange={addDimension}>
                            <SelectTrigger>
                              <SelectValue placeholder="Add dimension" />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldsByType.categorical
                                .filter(
                                  (field) =>
                                    !selectedDimensions.includes(field.name)
                                )
                                .map((field) => (
                                  <SelectItem
                                    key={field.name}
                                    value={field.name}
                                  >
                                    {field.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 pt-2 border-t">
                      {filteredData.length} of {rawData.length} records shown
                      <div className="mt-1">
                        Fields: {fieldsByType.numeric.length} numeric,{" "}
                        {fieldsByType.categorical.length} categorical,{" "}
                        {fieldsByType.boolean.length} boolean,{" "}
                        {fieldsByType.date.length} date
                      </div>
                    </div>
                  </>
                )}

                {availableFields.length === 0 &&
                  !dataLoading &&
                  selectedDataSet && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📋</div>
                      <p className="text-sm">No data available for filtering</p>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>

          {/* Charts Area */}
          <div className="lg:col-span-3 space-y-6">
            {dataLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p>Loading dataset...</p>
                </div>
              </div>
            ) : error ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">⚠️</div>
                  <h3 className="text-xl font-semibold mb-2">
                    Error Loading Data
                  </h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button onClick={loadDataSetContent}>Retry</Button>
                </CardContent>
              </Card>
            ) : rawData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">📈</div>
                  <h3 className="text-xl font-semibold mb-2">
                    No Data Available
                  </h3>
                  <p className="text-gray-600">
                    {selectedDataSet
                      ? "The selected dataset is empty or could not be loaded. Please check your data source."
                      : "Please select a dataset to view charts and analytics."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Key Metrics */}
                {Object.keys(chartData.metrics).length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(chartData.metrics).map(
                      ([metric, value]) => (
                        <Card key={metric}>
                          <CardContent className="p-6">
                            <div className="text-3xl font-bold">
                              {value.toLocaleString()}
                            </div>
                            <div className="text-gray-500 text-sm capitalize">
                              Total {metric}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </div>
                )}

                {/* Line Chart */}
                {chartData.lineChart.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {selectedMetrics[0]} Performance Over Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 relative">
                        <svg viewBox="0 0 800 200" className="w-full h-full">
                          {/* Grid lines */}
                          {[0, 1, 2, 3, 4, 5].map((i) => (
                            <line
                              key={i}
                              x1="50"
                              y1={40 + i * 32}
                              x2="750"
                              y2={40 + i * 32}
                              stroke="#e5e7eb"
                              strokeWidth="1"
                            />
                          ))}

                          {/* Y-axis labels */}
                          {(() => {
                            const maxValue = Math.max(
                              ...chartData.lineChart.map((d) => d.y)
                            );
                            const minValue = Math.min(
                              ...chartData.lineChart.map((d) => d.y)
                            );
                            const range = maxValue - minValue;
                            const step = range / 5;

                            return Array.from({ length: 6 }, (_, i) => {
                              const value = minValue + i * step;
                              return (
                                <text
                                  key={i}
                                  x="40"
                                  y={200 - 5 - i * 32}
                                  fontSize="12"
                                  fill="#6b7280"
                                  textAnchor="end"
                                >
                                  {value >= 1000
                                    ? `${(value / 1000).toFixed(1)}k`
                                    : Math.round(value).toLocaleString()}
                                </text>
                              );
                            });
                          })()}

                          {/* Line chart */}
                          {chartData.lineChart.length > 1 && (
                            <polyline
                              fill="none"
                              stroke="#06b6d4"
                              strokeWidth="2"
                              points={chartData.lineChart
                                .map((point, index) => {
                                  const maxValue = Math.max(
                                    ...chartData.lineChart.map((d) => d.y)
                                  );
                                  const minValue = Math.min(
                                    ...chartData.lineChart.map((d) => d.y)
                                  );
                                  const range = maxValue - minValue || 1;
                                  const x =
                                    50 +
                                    (index * 700) /
                                      (chartData.lineChart.length - 1);
                                  const y =
                                    200 -
                                    40 -
                                    ((point.y - minValue) / range) * 120;
                                  return `${x},${y}`;
                                })
                                .join(" ")}
                            />
                          )}

                          {/* Data points */}
                          {chartData.lineChart.map((point, index) => {
                            const maxValue = Math.max(
                              ...chartData.lineChart.map((d) => d.y)
                            );
                            const minValue = Math.min(
                              ...chartData.lineChart.map((d) => d.y)
                            );
                            const range = maxValue - minValue || 1;
                            const x =
                              50 +
                              (index * 700) /
                                Math.max(1, chartData.lineChart.length - 1);
                            const y =
                              200 - 40 - ((point.y - minValue) / range) * 120;
                            return (
                              <circle
                                key={index}
                                cx={x}
                                cy={y}
                                r="3"
                                fill="#06b6d4"
                              />
                            );
                          })}

                          {/* X-axis labels */}
                          {chartData.lineChart.map((point, index) => {
                            if (
                              index % 3 !== 0 &&
                              index !== chartData.lineChart.length - 1
                            )
                              return null;
                            const x =
                              50 +
                              (index * 700) /
                                Math.max(1, chartData.lineChart.length - 1);
                            return (
                              <text
                                key={index}
                                x={x}
                                y="195"
                                fontSize="10"
                                fill="#6b7280"
                                textAnchor="middle"
                              >
                                {point.x}
                              </text>
                            );
                          })}
                        </svg>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Pie Chart */}
                {chartData.pieChart.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {selectedMetrics[0]} by {selectedDimensions[0]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                        <div className="w-full md:w-2/3 h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={chartData.pieChart}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                              >
                                {chartData.pieChart.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                formatter={(value: number) => [
                                  value.toLocaleString(),
                                  selectedMetrics[0],
                                ]}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Legend */}
                        <div className="space-y-2">
                          {chartData.pieChart.map((segment, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: segment.color }}
                              />
                              <span className="text-sm">{segment.name}</span>
                              <span className="text-sm font-medium">
                                {segment.value.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
