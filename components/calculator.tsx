"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, History, X } from "lucide-react"

export default function CalculatorComponent() {
  const [input, setInput] = useState("0")
  const [result, setResult] = useState("")
  const [memory, setMemory] = useState(0)
  const [history, setHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const handleButtonClick = (value: string) => {
    if (input === "0" && !isNaN(Number(value)) && value !== "0") {
      setInput(value)
    } else if (input === "0" && value === "0") {
      setInput("0")
    } else if (input === "0" && ["+", "-", "*", "/"].includes(value)) {
      setInput("0" + value)
    } else if (input === "0" && value === ".") {
      setInput("0.")
    } else {
      setInput(input + value)
    }
  }

  const calculate = () => {
    try {
      // Replace × with * and ÷ with / for evaluation
      const sanitizedInput = input.replace(/×/g, "*").replace(/÷/g, "/")
      const evalResult = eval(sanitizedInput)
      setResult(evalResult.toString())
      setHistory([...history, `${input} = ${evalResult}`])
      setInput(evalResult.toString())
    } catch (error) {
      setResult("Error")
    }
  }

  const clearInput = () => {
    setInput("0")
    setResult("")
  }

  const clearAll = () => {
    setInput("0")
    setResult("")
    setHistory([])
  }

  const backspace = () => {
    if (input.length === 1) {
      setInput("0")
    } else {
      setInput(input.slice(0, -1))
    }
  }

  const handleMemoryOperation = (operation: string) => {
    switch (operation) {
      case "MC":
        setMemory(0)
        break
      case "MR":
        setInput(memory.toString())
        break
      case "M+":
        try {
          const currentValue = eval(input)
          setMemory(memory + currentValue)
        } catch (error) {
          // Handle error
        }
        break
      case "M-":
        try {
          const currentValue = eval(input)
          setMemory(memory - currentValue)
        } catch (error) {
          // Handle error
        }
        break
    }
  }

  const handleSpecialOperation = (operation: string) => {
    try {
      const currentValue = Number.parseFloat(input)

      switch (operation) {
        case "√":
          if (currentValue >= 0) {
            const sqrtResult = Math.sqrt(currentValue)
            setInput(sqrtResult.toString())
            setHistory([...history, `√(${currentValue}) = ${sqrtResult}`])
          } else {
            setResult("Error")
          }
          break
        case "x²":
          const squareResult = currentValue * currentValue
          setInput(squareResult.toString())
          setHistory([...history, `${currentValue}² = ${squareResult}`])
          break
        case "1/x":
          if (currentValue !== 0) {
            const reciprocalResult = 1 / currentValue
            setInput(reciprocalResult.toString())
            setHistory([...history, `1/${currentValue} = ${reciprocalResult}`])
          } else {
            setResult("Error")
          }
          break
        case "%":
          const percentResult = currentValue / 100
          setInput(percentResult.toString())
          break
      }
    } catch (error) {
      setResult("Error")
    }
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleButtonClick(e.key)
      } else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
        handleButtonClick(e.key)
      } else if (e.key === ".") {
        handleButtonClick(".")
      } else if (e.key === "Enter" || e.key === "=") {
        calculate()
      } else if (e.key === "Escape") {
        clearInput()
      } else if (e.key === "Backspace") {
        backspace()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [input])

  return (
    <div className="w-full max-w-md">
      <Tabs defaultValue="standard" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="standard" className="flex items-center gap-2">
            <Calculator size={16} />
            <span>Standard</span>
          </TabsTrigger>
          <TabsTrigger value="scientific" className="flex items-center gap-2">
            <Calculator size={16} />
            <span>Scientific</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="relative">
          <Card className="backdrop-blur-lg bg-black/30 border-none shadow-xl rounded-2xl overflow-hidden">
            {/* Display */}
            <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-right">
              <div className="text-gray-400 text-sm h-6 overflow-hidden">{result}</div>
              <div className="text-white text-4xl font-light tracking-wider overflow-x-auto whitespace-nowrap">
                {input}
              </div>
            </div>

            {/* History panel */}
            {showHistory && (
              <div className="absolute top-0 left-0 w-full h-full bg-black/90 z-10 p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white text-lg font-medium">History</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowHistory(false)}
                    className="text-white hover:bg-white/10"
                  >
                    <X size={18} />
                  </Button>
                </div>
                {history.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No history yet</p>
                ) : (
                  <div className="space-y-2">
                    {history.map((item, index) => (
                      <div key={index} className="text-white p-2 border-b border-gray-700">
                        {item}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full mt-4 text-red-400 border-red-400/30 hover:bg-red-400/10"
                      onClick={clearAll}
                    >
                      Clear All
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="grid grid-cols-4 gap-1 p-2">
              {/* Memory row */}
              <Button
                variant="ghost"
                className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                onClick={() => handleMemoryOperation("MC")}
              >
                MC
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                onClick={() => handleMemoryOperation("MR")}
              >
                MR
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                onClick={() => handleMemoryOperation("M+")}
              >
                M+
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                onClick={() => handleMemoryOperation("M-")}
              >
                M-
              </Button>

              {/* First row */}
              <Button
                variant="ghost"
                className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                onClick={clearInput}
              >
                C
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                onClick={() => handleSpecialOperation("√")}
              >
                √
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                onClick={() => handleSpecialOperation("%")}
              >
                %
              </Button>
              <Button
                variant="ghost"
                className="bg-purple-900/80 hover:bg-purple-800/80 text-white"
                onClick={() => handleButtonClick("/")}
              >
                ÷
              </Button>

              {/* Second row */}
              <Button
                variant="ghost"
                className="bg-gray-900/80 hover:bg-gray-800/80 text-white"
                onClick={() => handleButtonClick("7")}
              >
                7
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-900/80 hover:bg-gray-800/80 text-white"
                onClick={() => handleButtonClick("8")}
              >
                8
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-900/80 hover:bg-gray-800/80 text-white"
                onClick={() => handleButtonClick("9")}
              >
                9
              </Button>
              <Button
                variant="ghost"
                className="bg-purple-900/80 hover:bg-purple-800/80 text-white"
                onClick={() => handleButtonClick("*")}
              >
                ×
              </Button>

              {/* Third row */}
              <Button
                variant="ghost"
                className="bg-gray-900/80 hover:bg-gray-800/80 text-white"
                onClick={() => handleButtonClick("4")}
              >
                4
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-900/80 hover:bg-gray-800/80 text-white"
                onClick={() => handleButtonClick("5")}
              >
                5
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-900/80 hover:bg-gray-800/80 text-white"
                onClick={() => handleButtonClick("6")}
              >
                6
              </Button>
              <Button
                variant="ghost"
                className="bg-purple-900/80 hover:bg-purple-800/80 text-white"
                onClick={() => handleButtonClick("-")}
              >
                -
              </Button>

              {/* Fourth row */}
              <Button
                variant="ghost"
                className="bg-gray-900/80 hover:bg-gray-800/80 text-white"
                onClick={() => handleButtonClick("1")}
              >
                1
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-900/80 hover:bg-gray-800/80 text-white"
                onClick={() => handleButtonClick("2")}
              >
                2
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-900/80 hover:bg-gray-800/80 text-white"
                onClick={() => handleButtonClick("3")}
              >
                3
              </Button>
              <Button
                variant="ghost"
                className="bg-purple-900/80 hover:bg-purple-800/80 text-white"
                onClick={() => handleButtonClick("+")}
              >
                +
              </Button>

              {/* Fifth row */}
              <Button
                variant="ghost"
                className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                onClick={() => setShowHistory(true)}
              >
                <History size={18} />
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-900/80 hover:bg-gray-800/80 text-white"
                onClick={() => handleButtonClick("0")}
              >
                0
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-900/80 hover:bg-gray-800/80 text-white"
                onClick={() => handleButtonClick(".")}
              >
                .
              </Button>
              <Button
                variant="ghost"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                onClick={calculate}
              >
                =
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="scientific">
          <Card className="backdrop-blur-lg bg-black/30 border-none shadow-xl rounded-2xl overflow-hidden">
            {/* Display */}
            <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-right">
              <div className="text-gray-400 text-sm h-6 overflow-hidden">{result}</div>
              <div className="text-white text-4xl font-light tracking-wider overflow-x-auto whitespace-nowrap">
                {input}
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-5 gap-1 p-2">
              {/* Memory row */}
              <Button
                variant="ghost"
                className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                onClick={() => handleMemoryOperation("MC")}
              >
                MC
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                onClick={() => handleMemoryOperation("MR")}
              >
                MR
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                onClick={() => handleMemoryOperation("M+")}
              >
                M+
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                onClick={() => handleMemoryOperation("M-")}
              >
                M-
              </Button>
              <Button variant="ghost" className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300" onClick={backspace}>
                ⌫
              </Button>

              {/* Scientific functions */}
              <Button
                variant="ghost"
                className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                onClick={() => handleSpecialOperation("x²")}
              >
                x²
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                onClick={() => handleSpecialOperation("√")}
              >
                √
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                onClick={() => handleSpecialOperation("1/x")}
              >
                1/x
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                onClick={() => handleSpecialOperation("%")}
              >
                %
              </Button>
              <Button
                variant="ghost"
                className="bg-purple-900/80 hover:bg-purple-800/80 text-white"
                onClick={() => handleButtonClick("/")}
              >
                ÷
              </Button>

              {/* Number pad and operations */}
              <Button
                variant="ghost"
                className="bg-gray-900/80 hover:bg-gray-800/80 text-white"
                onClick={() => handleButtonClick("7")}
              >
                7
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-900/80 hover:bg-gray-800/80 text-white"
                onClick={() => handleButtonClick("8")}
              >
                8
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-900/80 hover:bg-gray-800/80 text-white"
                onClick={() => handleButtonClick("9")}
              >
                9
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                onClick={clearInput}
              >
                C
              </Button>
              <Button
                variant="ghost"
                className="bg-purple-900/80 hover:bg-purple-800/80 text-white"
                onClick={() => handleButtonClick("*")}
              >
                ×
              </Button>

              <Button
                variant="ghost"
                className="bg-gray-900/80 hover:bg-gray-800/80 text-white"
                onClick={() => handleButtonClick("4")}
              >
                4
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-900/80 hover:bg-gray-800/80 text-white"
                onClick={() => handleButtonClick("5")}
              >
                5
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-900/80 hover:bg-gray-800/80 text-white"
                onClick={() => handleButtonClick("6")}
              >
                6
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                onClick={() => handleButtonClick("(")}
              >
                (
              </Button>
              <Button
                variant="ghost"
                className="bg-purple-900/80 hover:bg-purple-800/80 text-white"
                onClick={() => handleButtonClick("-")}
              >
                -
              </Button>

              <Button
                variant="ghost"
                className="bg-gray-900/80 hover:bg-gray-800/80 text-white"
                onClick={() => handleButtonClick("1")}
              >
                1
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-900/80 hover:bg-gray-800/80 text-white"
                onClick={() => handleButtonClick("2")}
              >
                2
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-900/80 hover:bg-gray-800/80 text-white"
                onClick={() => handleButtonClick("3")}
              >
                3
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                onClick={() => handleButtonClick(")")}
              >
                )
              </Button>
              <Button
                variant="ghost"
                className="bg-purple-900/80 hover:bg-purple-800/80 text-white"
                onClick={() => handleButtonClick("+")}
              >
                +
              </Button>

              <Button
                variant="ghost"
                className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                onClick={() => setShowHistory(true)}
              >
                <History size={18} />
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-900/80 hover:bg-gray-800/80 text-white"
                onClick={() => handleButtonClick("0")}
              >
                0
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-900/80 hover:bg-gray-800/80 text-white"
                onClick={() => handleButtonClick(".")}
              >
                .
              </Button>
              <Button
                variant="ghost"
                className="col-span-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                onClick={calculate}
              >
                =
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
