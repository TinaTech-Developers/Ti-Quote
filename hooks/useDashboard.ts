"use client";

import { useEffect, useState } from "react";

type DashboardType = "super-admin" | "admin" | "staff";

export default function useDashboard(type: DashboardType) {
  const [data, setData] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  async function fetchDashboard() {
    try {
      setLoading(true);

      setError("");

      const response = await fetch(`/api/dashboard/${type}`, {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed loading dashboard");
      }

      setData(result);
    } catch (err: any) {
      console.error(err);

      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, [type]);

  return {
    data,

    loading,

    error,

    refresh: fetchDashboard,
  };
}
