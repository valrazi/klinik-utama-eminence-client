"use client"
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangePickerComponent = ({fetchData, setExportDate, fetchGraph}) => {
  const [startDate, setStartDate] = useState(dayjs().subtract(30, 'day').toDate());
  const [endDate, setEndDate] = useState(dayjs().toDate());

  useEffect(() => {
    const start = dayjs(startDate).format('YYYY-MM-DD');
    const end = dayjs(endDate).format('YYYY-MM-DD');
    console.log(`Selected range: ${start} to ${end}`);
    fetchData(start, end)
    fetchGraph(start, end)
    setExportDate([start, end])
  }, [startDate, endDate]);

  return (
    <div className="px-4">
      <div className="flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="border p-2 rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangePickerComponent;
