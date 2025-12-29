import React, { useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { Card, Button } from "@/components/ui";
import type { Practice } from "@/types";

interface Props {
  practice: Practice;
}

type TabType = "description" | "submissions";
type BottomTabType = "testcase" | "result";

export default function CodeEditor({ practice }: Props) {
  const defaultLang = practice.defaultLanguage || "javascript";
  const [language, setLanguage] = useState<string>(defaultLang);
  const [code, setCode] = useState<string>(
    practice.templates?.[defaultLang] || ""
  );
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<
    { idx: number; ok: boolean; actual: any; expected: any; error?: string }[]
  >([]);
  const [lastError, setLastError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [activeBottomTab, setActiveBottomTab] =
    useState<BottomTabType>("testcase");

  // Only show non-hidden testcases in UI and when running
  const visibleTests = (practice.tests || []).filter((t) => !t.isHidden);
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(200); // in pixels
  const [isDraggingVertical, setIsDraggingVertical] = useState(false);
  const languages = ["javascript"];
  // const languages = useMemo(
  //   () => Object.keys(practice.templates || {}),
  //   [practice]
  // );

  function getMonacoLanguage(lang: string): string {
    const languageMap: Record<string, string> = {
      javascript: "javascript",
      python: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      csharp: "csharp",
      go: "go",
      rust: "rust",
      typescript: "typescript",
    };
    return languageMap[lang] || "javascript";
    // return "javascript";
  }

  function getFirstFunctionName(js: string): string | null {
    const fnMatch = /function\s+([a-zA-Z0-9_$]+)/.exec(js);
    if (fnMatch) return fnMatch[1];
    const assignMatch = /(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=/.exec(js);
    if (assignMatch) return assignMatch[1];
    return null;
  }

  async function runJS() {
    setRunning(true);
    setResults([]);
    setLastError(null);

    try {
      const fnName = getFirstFunctionName(code);
      if (!fnName) {
        setLastError(
          "Không tìm thấy tên hàm trong mã JavaScript (ví dụ: function myFunc(...))."
        );
        setRunning(false);
        return;
      }

      // Build runner to extract the function
      let userFunc: any = null;
      try {
        // Create a Function that executes user code and returns the function by name
        const factory = new Function(
          `${code}\nreturn typeof ${fnName} !== 'undefined' ? ${fnName} : null;`
        );
        userFunc = factory();
        if (typeof userFunc !== "function") {
          setLastError("Định nghĩa hàm không trả về một function.");
          setRunning(false);
          return;
        }
      } catch (e: any) {
        setLastError(`Lỗi khi biên dịch mã: ${e.message || e}`);
        setRunning(false);
        return;
      }

      const testResults: typeof results = [];

      // Only run visible (non-hidden) test cases
      const visible = (practice.tests || []).filter((t) => !t.isHidden);
      for (let i = 0; i < visible.length; i++) {
        const t = visible[i];
        let args: any[] = [];
        // Try to parse inputs as JSON array by wrapping with []
        try {
          args = JSON.parse("[" + t.input + "]");
        } catch (e) {
          // fallback: single string argument
          args = [t.input];
        }

        let expected: any;
        try {
          expected = JSON.parse(t.output);
        } catch (e) {
          expected = t.output;
        }

        try {
          const actual = await Promise.resolve(userFunc.apply(null, args));
          const ok = JSON.stringify(actual) === JSON.stringify(expected);
          testResults.push({ idx: i, ok, actual, expected });
        } catch (err: any) {
          testResults.push({
            idx: i,
            ok: false,
            actual: null,
            expected,
            error: err?.message || String(err),
          });
        }
      }

      setResults(testResults);
    } finally {
      setRunning(false);
    }
  }

  function onRun() {
    setResults([]);
    setLastError(null);
    if (language === "javascript") {
      runJS();
    } else {
      setLastError(
        "Chạy bài tập hiện chỉ hỗ trợ JavaScript trong bản mô phỏng này."
      );
    }
  }

  async function onSubmit() {
    await onRun();
    const allPass = (practice.tests || []).every((_, idx) => results[idx]?.ok);
    if (results.length === 0) return; // results will be set after run completes
    if (results.every((r) => r.ok)) {
      alert("✅ Bài làm hợp lệ: Accepted (mock)");
    } else {
      alert("❌ Một số test chưa đúng. Kiểm tra output và thử lại.");
    }
  }

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
    if (newWidth > 30 && newWidth < 70) {
      setLeftPanelWidth(newWidth);
    }
  };

  const handleVerticalMouseDown = () => {
    setIsDraggingVertical(true);
  };

  const handleVerticalMouseUp = () => {
    setIsDraggingVertical(false);
  };

  const handleVerticalMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingVertical) return;
    const rightPanel = document.getElementById("right-panel");
    if (!rightPanel) return;
    const rect = rightPanel.getBoundingClientRect();
    const newHeight = rect.bottom - e.clientY;
    if (newHeight > 150 && newHeight < 600) {
      setBottomPanelHeight(newHeight);
    }
  };

  React.useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    if (isDragging) {
      document.addEventListener("mouseup", handleGlobalMouseUp);
      return () => document.removeEventListener("mouseup", handleGlobalMouseUp);
    }
  }, [isDragging]);

  React.useEffect(() => {
    const handleGlobalMouseUp = () => setIsDraggingVertical(false);
    if (isDraggingVertical) {
      document.addEventListener("mouseup", handleGlobalMouseUp);
      return () => document.removeEventListener("mouseup", handleGlobalMouseUp);
    }
  }, [isDraggingVertical]);

  return (
    <div
      className="flex gap-0 h-[95vh] bg-neutral-900 relative code-editor-container"
      onMouseMove={(e) => {
        handleMouseMove(e);
        handleVerticalMouseMove(e);
      }}
      onMouseUp={() => {
        handleMouseUp();
        handleVerticalMouseUp();
      }}
    >
      {/* Left Panel - Description */}
      <div
        className="flex flex-col border-r border-neutral-700 bg-neutral-900 overflow-hidden"
        style={{ width: `${leftPanelWidth}%` }}
      >
        {/* Tabs */}
        <div className="flex border-b border-neutral-700 bg-neutral-800">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "description"
                ? "text-blue-400 border-b-2 border-blue-400 bg-neutral-900"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "submissions"
                ? "text-blue-400 border-b-2 border-blue-400 bg-neutral-900"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Submissions
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-neutral-900">
          {activeTab === "description" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-semibold text-neutral-100">
                  {practice.title}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    practice.difficulty === "easy"
                      ? "bg-green-900 text-green-300"
                      : practice.difficulty === "medium"
                      ? "bg-yellow-900 text-yellow-300"
                      : "bg-red-900 text-red-300"
                  }`}
                >
                  {practice.difficulty}
                </span>
              </div>

              <div className="mb-4 text-neutral-300 whitespace-pre-wrap leading-relaxed">
                {practice.description}
              </div>

              <div className="mb-4">
                <div className="text-sm font-semibold text-neutral-300 mb-2">
                  Tags:
                </div>
                <div className="flex gap-2 flex-wrap">
                  {practice.tags?.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-3 py-1 bg-neutral-800 text-neutral-300 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Example Test Cases */}
              <div className="mt-6">
                <div className="text-sm font-semibold text-neutral-300 mb-3">
                  Example Test Cases:
                </div>
                {visibleTests.slice(0, 2).map((t, i) => (
                  <div key={i} className="mb-4 p-3 bg-neutral-800 rounded">
                    <div className="text-sm font-mono text-neutral-300">
                      <strong>Input:</strong> {t.input}
                    </div>
                    <div className="text-sm font-mono mt-1 text-neutral-300">
                      <strong>Output:</strong> {t.output}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "submissions" && (
            <div className="text-neutral-400">
              <p>No submissions yet. Submit your solution to see history.</p>
            </div>
          )}
        </div>
      </div>

      {/* Resizable Divider */}
      <div
        className={`w-1 bg-neutral-700 hover:bg-blue-500 cursor-col-resize transition-colors ${
          isDragging ? "bg-blue-500" : ""
        }`}
        onMouseDown={handleMouseDown}
      />

      {/* Right Panel - Code Editor */}
      <div
        id="right-panel"
        className="flex flex-col bg-neutral-900 overflow-hidden"
        style={{ width: `${100 - leftPanelWidth}%` }}
      >
        {/* Editor Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-700 bg-neutral-800">
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              setCode(practice.templates?.[e.target.value] || "");
            }}
            className="border border-neutral-600 rounded px-3 py-1 text-sm bg-neutral-700 text-neutral-200"
          >
            {languages.map((l) => (
              <option key={l} value={l}>
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCode(practice.templates?.[language] || "")}
            >
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRun}
              disabled={running}
            >
              {running ? "Running..." : "▶ Run"}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onSubmit}
              disabled={running}
            >
              Submit
            </Button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div
          className="overflow-hidden"
          style={{ height: `calc(100% - ${bottomPanelHeight}px - 45px)` }}
        >
          <Editor
            height="100%"
            language={getMonacoLanguage(language)}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: "on",
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              suggest: {
                snippetsPreventQuickSuggestions: false,
              },
            }}
          />
        </div>

        {/* Vertical Resizable Divider */}
        <div
          className={`h-1 bg-neutral-700 hover:bg-blue-500 cursor-row-resize transition-colors ${
            isDraggingVertical ? "bg-blue-500" : ""
          }`}
          onMouseDown={handleVerticalMouseDown}
        />

        {/* Bottom Tabs */}
        <div className="border-neutral-700 flex flex-col">
          <div className="flex border-b border-neutral-700 bg-neutral-800">
            <button
              onClick={() => setActiveBottomTab("testcase")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeBottomTab === "testcase"
                  ? "text-blue-400 border-b-2 border-blue-400 bg-neutral-900"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Testcase
            </button>
            <button
              onClick={() => setActiveBottomTab("result")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeBottomTab === "result"
                  ? "text-blue-400 border-b-2 border-blue-400 bg-neutral-900"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Test Result
            </button>
          </div>

          {/* Bottom Content */}
          <div className="p-4 flex-1 overflow-y-auto bg-neutral-900">
            {activeBottomTab === "testcase" && (
              <div>
                {/* Scrollable container for test cases */}
                <div
                  className="overflow-y-auto pr-2"
                  style={{ maxHeight: Math.max(bottomPanelHeight - 80, 120) }}
                >
                  {visibleTests.map((t, i) => (
                    <div key={i} className="mb-3">
                      <div className="text-xs font-semibold text-neutral-400 mb-1">
                        Case {i + 1}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="text-neutral-400">Input = </span>
                          <code className="bg-neutral-800 px-2 py-1 rounded font-mono text-sm text-neutral-200">
                            {t.input}
                          </code>
                        </div>
                        <div className="text-sm">
                          <span className="text-neutral-400">Expected = </span>
                          <code className="bg-neutral-800 px-2 py-1 rounded font-mono text-sm text-neutral-200">
                            {t.output}
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {visibleTests.length === 0 && (
                  <div className="text-neutral-400">
                    No visible test cases available.
                  </div>
                )}
              </div>
            )}

            {activeBottomTab === "result" && (
              <div>
                {lastError && (
                  <div className="text-red-400 mb-3 text-sm">{lastError}</div>
                )}
                {results.length === 0 ? (
                  <div className="text-neutral-400 text-sm">
                    Run your code to see results here.
                  </div>
                ) : (
                  <div
                    className="space-y-3 overflow-y-auto pr-2"
                    style={{ maxHeight: Math.max(bottomPanelHeight - 80, 120) }}
                  >
                    {results.map((r) => (
                      <div
                        key={r.idx}
                        className={`p-3 rounded border ${
                          r.ok
                            ? "bg-green-950 border-green-700"
                            : "bg-red-950 border-red-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-neutral-200">
                            Test Case {r.idx + 1}
                          </span>
                          <span
                            className={`text-sm font-semibold ${
                              r.ok ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {r.ok ? "✓ Passed" : "✗ Failed"}
                          </span>
                        </div>
                        {!r.ok && r.error && (
                          <div className="text-sm text-red-400 mb-2">
                            Error: {r.error}
                          </div>
                        )}
                        <div className="text-xs space-y-1">
                          <div>
                            <span className="text-neutral-400">Input: </span>
                            <code className="bg-neutral-800 px-2 py-1 rounded text-neutral-200">
                              {visibleTests[r.idx]?.input}
                            </code>
                          </div>
                          <div>
                            <span className="text-neutral-400">Output: </span>
                            <code className="bg-neutral-800 px-2 py-1 rounded text-neutral-200">
                              {JSON.stringify(r.actual)}
                            </code>
                          </div>
                          <div>
                            <span className="text-neutral-400">Expected: </span>
                            <code className="bg-neutral-800 px-2 py-1 rounded text-neutral-200">
                              {JSON.stringify(r.expected)}
                            </code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
