import React, {ChangeEvent, useState} from 'react';
import {evenRowStyles, tableStyles, tdInputStyles, thStyles, thTdStyles} from "./tableStyles.ts";

const TableInput: React.FC<any> = ({rows, parameters, columns}: any) => {
    const [data, setData] = useState<string[][]>(
        Array.from({length: rows}, () => Array(columns).fill(''))
    );

    // Handle input change in the table cells
    const handleChange = (rowIndex: number, columnIndex: number, value: string) => {
        const newData = [...data];
        newData[rowIndex][columnIndex] = value;
        setData(newData);
    };

    // Create headers based on parameters and readings
    const headers = parameters.flatMap((param: any) =>
        Array.from({length: param.custom_readings_count}, (_, i) =>
            param.custom_readings_count > 1 ? `${param.specification} ${i + 1}` : param.specification
        )
    );

    return (
        <div>
            {/* @ts-expect-error err */}
            <table style={tableStyles}>
                <thead>
                <tr>
                    {/* @ts-expect-error err */}
                    <th style={thStyles} align={"center"}>
                        S<br/>No.
                    </th>
                    {headers.map((header: any, index: any) => (
                        <>
                            {/* @ts-expect-error err */}
                            <th style={thStyles} key={index}>{header}</th>
                        </>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} style={rowIndex % 2 !== 0 ? evenRowStyles : {}}>
                        {/* @ts-expect-error err */}
                        <td style={thTdStyles}>
                            {rowIndex + 1}
                        </td>
                        {row.map((cell, columnIndex) => (
                            <>
                                {/* @ts-expect-error err */}
                                <td key={columnIndex} style={thTdStyles}>
                                    <input
                                        type="text"
                                        value={cell}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            handleChange(rowIndex, columnIndex, e.target.value)
                                        }
                                        style={tdInputStyles}
                                    />
                                </td>
                            </>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableInput;
