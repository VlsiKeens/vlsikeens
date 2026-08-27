"use client";

import SectionHeader from "@/components/common/SectionHeader";
import SelectionCard from "@/components/common/SelectionCard";
import SelectionGrid from "@/components/common/SelectionGrid";

export interface SelectionOption {
  id: string;
  title: string;
  description: string;
  badge?: string;
  disabled?: boolean;
}

interface SelectionStepProps {
  title: string;
  subtitle: string;
  options: SelectionOption[];
  selectedValue?: string;
  onSelect: (id: string) => void;
  unavailableMessage?: string;
}

export default function SelectionStep({
  title,
  subtitle,
  options,
  selectedValue,
  onSelect,
  unavailableMessage,
}: SelectionStepProps) {
  return (
    <div className="space-y-8">
      <SectionHeader
        title={title}
        subtitle={subtitle}
      />

      <SelectionGrid>
        {options.map((option) => (
          <SelectionCard
            key={option.id}
            title={option.title}
            description={option.description}
            badge={option.badge}
            selected={selectedValue === option.id}
            disabled={option.disabled}
            statusMessage={
              option.disabled ? unavailableMessage : undefined
            }
            onClick={() => onSelect(option.id)}
          />
        ))}
      </SelectionGrid>
    </div>
  );
}
