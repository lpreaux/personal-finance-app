"use client";

import { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

/**
 * Sandbox Page - Development Only
 *
 * This page allows importing transaction data from a JSON file during development.
 * It should only be accessible in development mode (protected by middleware).
 *
 * Expected JSON format:
 * {
 *   "transactions": [
 *     {
 *       "avatar": "./assets/images/avatars/emma-richardson.jpg",
 *       "name": "Emma Richardson",
 *       "category": "General",
 *       "date": "2024-08-19T14:23:11Z",
 *       "amount": 75.50,
 *       "recurring": false
 *     }
 *   ]
 * }
 */
export default function SandboxPage() {
  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [clearExisting, setClearExisting] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importTransactions = useMutation(api.transaction.importTransactions);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus({ type: "idle", message: "" });
    }
  };

  const handleImport = async () => {
    if (!file) {
      setStatus({ type: "error", message: "Please select a file first" });
      return;
    }

    if (!user) {
      setStatus({
        type: "error",
        message: "You must be signed in to import data",
      });
      return;
    }

    setStatus({ type: "loading", message: "Importing transactions..." });

    try {
      // Read and parse the JSON file
      const fileContent = await file.text();
      const data = JSON.parse(fileContent);

      // Validate the data structure
      if (!data.transactions || !Array.isArray(data.transactions)) {
        throw new Error(
          'Invalid file format. Expected JSON with "transactions" array property.',
        );
      }

      // Validate each transaction has required fields
      for (const transaction of data.transactions) {
        if (
          !transaction.name ||
          !transaction.category ||
          !transaction.date ||
          typeof transaction.amount !== "number" ||
          typeof transaction.recurring !== "boolean"
        ) {
          throw new Error(
            "Invalid transaction format. Each transaction must have: name, category, date, amount, recurring",
          );
        }
      }

      // Import transactions
      const result = await importTransactions({
        userId: user.id,
        transactions: data.transactions,
        clearExisting,
      });

      setStatus({
        type: "success",
        message: `Successfully imported ${result.imported} transaction(s)${result.cleared ? " (existing transactions were cleared)" : ""}`,
      });

      // Clear the file input
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Import error:", error);
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to import transactions. Check the console for details.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-orange-100 p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-preset-1 mb-2 text-gray-900">
            🧪 Sandbox - Data Import
          </h1>
          <p className="text-preset-4 text-gray-500">
            Development only: Import transaction data from JSON file
          </p>
        </div>

        {/* Warning Banner */}
        <div className="mb-6 rounded-lg border-2 border-yellow-500 bg-yellow-50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-preset-4-bold text-yellow-900">
                Development Environment Only
              </p>
              <p className="text-preset-5 mt-1 text-yellow-800">
                This page is only available in development mode and should not
                be accessible in production.
              </p>
            </div>
          </div>
        </div>

        {/* Import Card */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-preset-2 mb-4 text-gray-900">
            Import Transactions
          </h2>

          {/* File Upload */}
          <div className="mb-6">
            <label
              htmlFor="file-upload"
              className="text-preset-5-bold mb-2 block text-gray-900"
            >
              Select JSON File
            </label>
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="text-preset-5 w-full cursor-pointer rounded-lg border-2 border-gray-300 p-3 transition-colors file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-teal-800 file:px-4 file:py-2 file:text-white file:transition-colors hover:border-gray-400 file:hover:bg-teal-700"
            />
            {file && (
              <p className="text-preset-5 mt-2 text-gray-500">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {/* Clear Existing Checkbox */}
          <div className="mb-6">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={clearExisting}
                onChange={(e) => setClearExisting(e.target.checked)}
                className="h-5 w-5 cursor-pointer rounded border-gray-300 text-teal-800 focus:ring-2 focus:ring-teal-800 focus:ring-offset-2"
              />
              <span className="text-preset-4 text-gray-900">
                Clear existing transactions before import
              </span>
            </label>
            <p className="text-preset-5 mt-1 ml-8 text-gray-500">
              Warning: This will delete all your current transactions
            </p>
          </div>

          {/* Import Button */}
          <button
            onClick={handleImport}
            disabled={!file || status.type === "loading"}
            className="text-preset-4-bold w-full rounded-lg bg-teal-800 px-6 py-3 text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          >
            {status.type === "loading" ? "Importing..." : "Import Transactions"}
          </button>

          {/* Status Message */}
          {status.message && (
            <div
              className={`mt-4 rounded-lg p-4 ${
                status.type === "success"
                  ? "bg-green-50 text-green-800"
                  : status.type === "error"
                    ? "bg-red-50 text-red-800"
                    : "bg-blue-50 text-blue-800"
              }`}
            >
              <p className="text-preset-4-bold">
                {status.type === "success"
                  ? "✅ Success"
                  : status.type === "error"
                    ? "❌ Error"
                    : "ℹ️ Info"}
              </p>
              <p className="text-preset-5 mt-1">{status.message}</p>
            </div>
          )}
        </div>

        {/* Expected Format */}
        <div className="mt-6 rounded-lg bg-gray-900 p-6">
          <h3 className="text-preset-4-bold mb-3 text-white">
            Expected JSON Format
          </h3>
          <pre className="text-preset-5 overflow-x-auto text-gray-300">
            {JSON.stringify(
              {
                transactions: [
                  {
                    avatar: "./assets/images/avatars/emma-richardson.jpg",
                    name: "Emma Richardson",
                    category: "General",
                    date: "2024-08-19T14:23:11Z",
                    amount: 75.5,
                    recurring: false,
                  },
                  {
                    avatar: "./assets/images/avatars/savory-bites-bistro.jpg",
                    name: "Savory Bites Bistro",
                    category: "Dining Out",
                    date: "2024-08-19T20:23:11Z",
                    amount: -55.5,
                    recurring: false,
                  },
                ],
              },
              null,
              2,
            )}
          </pre>
        </div>

        {/* Instructions */}
        <div className="mt-6 rounded-lg bg-blue-50 p-6">
          <h3 className="text-preset-4-bold mb-3 text-blue-900">
            📖 Instructions
          </h3>
          <ul className="text-preset-5 space-y-2 text-blue-800">
            <li>1. Prepare a JSON file with a "transactions" array</li>
            <li>
              2. Each transaction must have: name, category, date, amount,
              recurring
            </li>
            <li>3. Optional fields: avatar (string)</li>
            <li>4. Amount: positive = income, negative = expense</li>
            <li>5. Date: ISO 8601 format (e.g., "2024-08-19T14:23:11Z")</li>
            <li>6. Select your file and click "Import Transactions"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
