import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Papa from "papaparse";

export default function TradingDiary() {
  const [fileName, setFileName] = useState("");
  const [emotions, setEmotions] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const data = results.data;
          const symbolStats = {};

          data.forEach((row) => {
            const item = row["Item"];
            const profit = parseFloat(row["Profit"]);
            if (!item || isNaN(profit)) return;
            if (!symbolStats[item]) {
              symbolStats[item] = { total: 0, count: 0 };
            }
            symbolStats[item].total += profit;
            symbolStats[item].count++;
          });

          const profitableSymbols = Object.entries(symbolStats)
            .filter(([_, val]) => val.total > 0)
            .map(([sym]) => sym);

          const losingSymbols = Object.entries(symbolStats)
            .filter(([_, val]) => val.total < 0)
            .map(([sym]) => sym);

          setAnalysisResult({
            profitableSymbols,
            losingSymbols,
            averageHoldingTime: "--:--", // Placeholder
            suggestions: [
              ...profitableSymbols.map((s) => `Символ ${s} стабильно прибыльный — можно масштабировать.`),
              ...losingSymbols.map((s) => `Символ ${s} убыточный — стоит проанализировать стратегию.`)
            ]
          });
        }
      });
    }
  };

  return (
    <div className="p-6 grid gap-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">AI-дневник трейдера</h1>

      <Card>
        <CardContent className="p-4 grid gap-4">
          <label className="font-medium">Загрузить отчёт сделок (.html/.csv)</label>
          <Input type="file" accept=".csv,.html" onChange={handleFileUpload} />
          {fileName && <p className="text-sm text-muted-foreground">Загружено: {fileName}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 grid gap-4">
          <label className="font-medium">Что вы чувствовали в момент сделки?</label>
          <Textarea value={emotions} onChange={(e) => setEmotions(e.target.value)} rows={3} />

          <label className="font-medium">Почему вы приняли решение войти в сделку?</label>
          <Textarea value={reasoning} onChange={(e) => setReasoning(e.target.value)} rows={3} />
        </CardContent>
      </Card>

      {analysisResult && (
        <Card>
          <CardContent className="p-4 grid gap-2">
            <h2 className="text-lg font-semibold">AI-анализ</h2>
            <p><strong>Прибыльные символы:</strong> {analysisResult.profitableSymbols.join(", ")}</p>
            <p><strong>Убыточные символы:</strong> {analysisResult.losingSymbols.join(", ")}</p>
            <p><strong>Среднее удержание:</strong> {analysisResult.averageHoldingTime}</p>
            <ul className="list-disc pl-5 mt-2">
              {analysisResult.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
