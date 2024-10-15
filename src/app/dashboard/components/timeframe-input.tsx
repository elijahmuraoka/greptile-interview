import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

type TimeframeUnit = 'days' | 'months' | 'years';

interface TimeframeInputProps {
    timeframe: { unit: TimeframeUnit; value: number };
    setTimeframe: React.Dispatch<
        React.SetStateAction<{ unit: TimeframeUnit; value: number }>
    >;
}

const TimeframeInput: React.FC<TimeframeInputProps> = ({
    timeframe,
    setTimeframe,
}) => {
    return (
        <div className="flex items-center space-x-2">
            <Input
                type="number"
                value={timeframe.value}
                onChange={(e) =>
                    setTimeframe((prev) => ({
                        ...prev,
                        value: parseInt(e.target.value) || 0,
                    }))
                }
                className="w-20"
            />
            <Select
                value={timeframe.unit}
                onValueChange={(value: TimeframeUnit) =>
                    setTimeframe((prev) => ({ ...prev, unit: value }))
                }
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="years">Years</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default TimeframeInput;
