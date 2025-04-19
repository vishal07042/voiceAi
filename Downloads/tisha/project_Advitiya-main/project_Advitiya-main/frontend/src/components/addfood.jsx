import React, { useState } from "react";

export default function FarmerSurplus() {
  const [surplus, setSurplus] = useState([]);
  const [form, setForm] = useState({
    crop: "",
    quantity: "",
    date: "",
    status: "Available"
  });

  const activityFeed = [
    { name: "Farmer Amar", action: "Posted surplus Wheat", time: "2m" },
    { name: "NGO Seva", action: "Requested Tomatoes", time: "1h" },
    { name: "Retailer FreshMart", action: "Claimed Rice", time: "3h" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!form.crop || !form.quantity || !form.date) return alert("Please fill all fields.");
    setSurplus([...surplus, form]);
    setForm({ crop: "", quantity: "", date: "", status: "Available" });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r px-6 py-4">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6">FarmerSurplus</h2>
        <nav className="space-y-3">
          <a href="#" className="block text-gray-700 hover:text-indigo-600 font-medium">Dashboard</a>
          <a href="#" className="block text-indigo-600 font-semibold">Surplus</a>
          <a href="#" className="block text-gray-700 hover:text-indigo-600">NGO Requests</a>
          <a href="#" className="block text-gray-700 hover:text-indigo-600">Analytics</a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-10 py-6">
        <div className="flex justify-between items-center mb-6">
          <input type="text" placeholder="Search surplus..." className="px-4 py-2 border rounded w-1/3" />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">New Project</button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Form + Surplus List */}
          <div className="col-span-2 space-y-8">
            {/* Add Surplus Form */}
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-lg font-semibold mb-4">Add Surplus Item</h2>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="crop"
                  value={form.crop}
                  onChange={handleChange}
                  placeholder="Crop name"
                  className="border px-3 py-2 rounded w-full"
                />
                <input
                  type="text"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="Quantity (e.g. 100kg)"
                  className="border px-3 py-2 rounded w-full"
                />
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="border px-3 py-2 rounded w-full"
                />
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="border px-3 py-2 rounded w-full"
                >
                  <option value="Available">Available</option>
                  <option value="Pending">Pending</option>
                  <option value="Donated">Donated</option>
                </select>
              </div>
              <button
                onClick={handleAdd}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Add Surplus
              </button>
            </div>

            {/* Surplus List */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Surplus Items</h2>
              <ul className="space-y-4">
                {surplus.map((item, index) => (
                  <li key={index} className="bg-white p-4 rounded shadow flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{item.crop} / {item.quantity}</p>
                      <p className="text-sm text-gray-500">Posted on {item.date}</p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        item.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Activity Feed</h2>
            <ul className="space-y-4">
              {activityFeed.map((act, idx) => (
                <li key={idx} className="bg-white p-4 rounded shadow">
                  <p className="text-sm font-semibold text-gray-900">{act.name}</p>
                  <p className="text-sm text-gray-500">{act.action} • {act.time} ago</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}