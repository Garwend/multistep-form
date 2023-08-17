"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Command } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

type CreatableInputProps = {
  value: string[];
  onValueChange: (value: string[]) => void;
};

export default function CreatableInput({
  value,
  onValueChange,
}: CreatableInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback(
    (v: string) => {
      onValueChange(value.filter((item) => item !== v));
    },
    [onValueChange, value]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            const deleteLastElementFromArray = () => {
              const newValue = [...value];
              newValue.pop();
              return newValue;
            };
            onValueChange(deleteLastElementFromArray());
          }
        }
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [onValueChange, value]
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {value.map((item) => {
            return (
              <Badge
                key={item}
                variant="secondary"
                className="bg-border text-foreground text-xs font-medium px-3"
              >
                {item}
                <button
                  className="ml-[6px] ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(item);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(item)}
                >
                  <X className="h-3 w-3 text-foreground" strokeWidth={3} />
                </button>
              </Badge>
            );
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (
                  inputValue.trim().length !== 0 &&
                  !value.includes(inputValue)
                ) {
                  onValueChange([...value, inputValue.trim()]);
                  setInputValue("");
                }
              }
            }}
            placeholder="Add..."
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
    </Command>
  );
}
