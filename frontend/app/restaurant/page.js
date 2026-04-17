"use client";

import { useEffect, useState } from "react";
import { getRestaurant } from "@/lib/api";

export default function RestaurantPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // fetch restaurant only
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRestaurant();
        const restaurant = res.restaurant || res;
        setData(restaurant);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // =========================
  // loading / empty
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No restaurant data found
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">🍽️ Restaurant Information</h1>
        <p className="text-gray-500 mt-2">
          About our restaurant
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-2xl shadow p-8 space-y-6">

          {/* NAME */}
          <div className="text-center">
            <h2 className="text-2xl font-bold">{data.name}</h2>
          </div>

          {/* HOURS */}
          <div className="grid md:grid-cols-2 gap-4">

            <div className="bg-gray-50 p-5 rounded-xl text-center">
              <p className="text-gray-500 text-sm">Opening Hour</p>
              <p className="text-lg font-semibold">{data.openingHour}</p>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl text-center">
              <p className="text-gray-500 text-sm">Closing Hour</p>
              <p className="text-lg font-semibold">{data.closingHour}</p>
            </div>

          </div>

          {/* CONTACT */}
          <div className="grid md:grid-cols-2 gap-4">

            <div className="bg-gray-50 p-5 rounded-xl text-center">
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="font-semibold">{data.contact?.phone}</p>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl text-center">
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-semibold">{data.contact?.email}</p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}