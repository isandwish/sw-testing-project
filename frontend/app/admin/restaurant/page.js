"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import { getRestaurant, updateRestaurant } from "@/lib/api";

export default function RestaurantSettings() {
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({});

  // protect route
  useEffect(() => {
    const u = getUser();

    if (!u || u.role !== "admin") {
      router.push("/");
    }
  }, []);

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRestaurant();
        const restaurant = res.restaurant || res;

        setData(restaurant);
        setForm(restaurant); // 👈 prepare edit form
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        name: form.name,
        openingHour: form.openingHour,
        closingHour: form.closingHour,
        contact: {
          phone: form.contact?.phone,
          email: form.contact?.email,
        },
      };

      const res = await updateRestaurant(payload);

      if (res.restaurant) {
        setData(res.restaurant);
        setForm(res.restaurant);
        setIsEdit(false);
      } else {
        alert(res.error || "Update failed");
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">

      <div className="bg-white w-full max-w-xl p-6 rounded-xl shadow space-y-4">

        <h1 className="text-2xl font-bold text-center">
          ⚙️ Restaurant Settings
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : !data ? (
          <p className="text-center text-gray-500">No data found</p>
        ) : (
          <div className="space-y-3 text-sm">

            {/* Name */}
            <div className="border p-3 rounded">
              <p className="text-gray-500">Restaurant Name</p>

              {isEdit ? (
                <input
                  className="border p-2 w-full mt-1"
                  value={form.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              ) : (
                <p className="font-semibold">{data.name}</p>
              )}
            </div>

            {/* Opening */}
            <div className="border p-3 rounded">
              <p className="text-gray-500">Opening Hour</p>

              {isEdit ? (
                <input
                  className="border p-2 w-full mt-1"
                  value={form.openingHour || ""}
                  onChange={(e) =>
                    handleChange("openingHour", e.target.value)
                  }
                />
              ) : (
                <p className="font-semibold">{data.openingHour}</p>
              )}
            </div>

            {/* Closing */}
            <div className="border p-3 rounded">
              <p className="text-gray-500">Closing Hour</p>

              {isEdit ? (
                <input
                  className="border p-2 w-full mt-1"
                  value={form.closingHour || ""}
                  onChange={(e) =>
                    handleChange("closingHour", e.target.value)
                  }
                />
              ) : (
                <p className="font-semibold">{data.closingHour}</p>
              )}
            </div>

            {/* Phone */}
            <div className="border p-3 rounded">
              <p className="text-gray-500">Phone</p>

              {isEdit ? (
                <input
                  className="border p-2 w-full mt-1"
                  value={form.contact?.phone || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      contact: {
                        ...prev.contact,
                        phone: e.target.value,
                      },
                    }))
                  }
                />
              ) : (
                <p className="font-semibold">{data.contact?.phone}</p>
              )}
            </div>

            {/* Email */}
            <div className="border p-3 rounded">
              <p className="text-gray-500">Email</p>

              {isEdit ? (
                <input
                  className="border p-2 w-full mt-1"
                  value={form.contact?.email || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      contact: {
                        ...prev.contact,
                        email: e.target.value,
                      },
                    }))
                  }
                />
              ) : (
                <p className="font-semibold">{data.contact?.email}</p>
              )}
            </div>

          </div>
        )}

        {/* ACTION BUTTONS */}
        {!loading && data && (
          <div className="flex gap-2 pt-2">

            {!isEdit ? (
              <button
                onClick={() => setIsEdit(true)}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                ✏️ Edit
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsEdit(false);
                    setForm(data);
                  }}
                  className="w-1/2 bg-gray-300 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-1/2 bg-green-500 text-white py-2 rounded disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </>
            )}

          </div>
        )}

      </div>
    </div>
  );
}