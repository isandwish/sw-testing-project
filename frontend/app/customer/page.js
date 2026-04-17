"use client";

import { useState } from "react";
import {
  getAvailability,
  createReservation,
  updateReservation,
  cancelReservation,
} from "@/lib/api";

export default function Customer() {
  const [form, setForm] = useState({
    date: "",
    time: "",
    guestCount: 1,
    specialRequest: "",
  });

  const [reservationId, setReservationId] = useState(null);
  const [result, setResult] = useState(null);

  const check = async () => {
    const res = await getAvailability(form);
    setResult(res);
  };

  const book = async () => {
    const res = await createReservation(form);
    setReservationId(res.reservationId);
    setResult(res);
  };

  const modify = async () => {
    const res = await updateReservation(reservationId, form);
    setResult(res);
  };

  const cancel = async () => {
    const res = await cancelReservation(reservationId);
    setResult(res);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Customer Dashboard</h1>

      <div className="bg-white p-4 rounded shadow space-y-2 w-96">
        <input type="date" className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, date: e.target.value })} />

        <input type="time" className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, time: e.target.value })} />

        <input type="number" className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, guestCount: Number(e.target.value) })} />

        <input className="border p-2 w-full" placeholder="special request"
          onChange={(e) => setForm({ ...form, specialRequest: e.target.value })} />

        <button onClick={check} className="bg-blue-500 text-white w-full p-2">Check Availability</button>
        <button onClick={book} className="bg-green-500 text-white w-full p-2">Book</button>
        <button onClick={modify} className="bg-yellow-500 text-white w-full p-2">Modify</button>
        <button onClick={cancel} className="bg-red-500 text-white w-full p-2">Cancel</button>

        <pre className="text-xs bg-gray-100 p-2">{JSON.stringify(result, null, 2)}</pre>
      </div>
    </div>
  );
}