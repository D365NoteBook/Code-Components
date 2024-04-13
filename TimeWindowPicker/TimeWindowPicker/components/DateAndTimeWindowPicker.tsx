import * as React from 'react';
import {
    DatePicker,
    IIconStyles,
    IStackStyles,
    IStackTokens,
    Icon,
    Stack,
    IDropdownStyles,
    Dropdown,
    IDropdownOption
} from '@fluentui/react';

export interface IDateAndTimeRangePicker {
    timeFrom: Date,
    timeTo: Date,
    increment: number,
    hourFormat: number,
    notifyOutputChanged: (timeFrom: Date, timeTo: Date) => void;
}

enum HourFormat {
    Hour24 = 0,
    Hour12 = 1
}

const stackStyles: Partial<IStackStyles> = {
    root: {
        // width: '100%',
        ':hover': {
            border: '1px solid rgb(102, 102, 102)'
        }
    }
};

const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { minWidth: 150, textAlign: 'left' },
    title: { borderStyle: 'none' }
};

const generateTimeList = (start: string, increment: number, hourFormat: number): string[] => {
    let timeStrings: string[] = [];
    let startTime = new Date(`1970-01-01T${start}:00`);
    let timeList: Date[] = [new Date(startTime.getTime())];

    let flag = true;
    while (flag) {
        startTime.setMinutes(startTime.getMinutes() + increment);
        if (startTime.getDate() > 1) {
            flag = false;
            break;
        }
        timeList.push(new Date(startTime.getTime()));
    }

    if (hourFormat === HourFormat.Hour24) {
        timeStrings = timeList.map(time => {
            let hours = time.getHours().toString().padStart(2, '0');
            let minutes = time.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        });
    }

    if (hourFormat === HourFormat.Hour12) {
        timeStrings = timeList.map(time => {
            let hours = time.getHours();
            let minutes = time.getMinutes().toString().padStart(2, '0');
            let period = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            return `${hours.toString().padStart(2, '0')}:${minutes} ${period}`;
        });
    }
    return timeStrings;
}

const onRenderTitleFrom = (options?: IDropdownOption[]) => {
    if (options && options.length > 0) {
        const option = options[0];

        return (
            <div>
                <span>{`From: ${option.text}`}</span>
            </div>
        );
    }

    return <></>;
};

const onRenderTitleTo = (options?: IDropdownOption[]) => {
    if (options && options.length > 0) {
        const option = options[0];

        return (
            <div>
                <span>{`To: ${option.text}`}</span>
            </div>
        );
    }

    return <></>;
};

const getTimeString12HourFormat = (time: Date) => {
    let hours = time.getHours();
    let minutes = time.getMinutes().toString().padStart(2, '0');
    let period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${hours.toString().padStart(2, '0')}:${minutes} ${period}`;
}

const getTimeString24HourFormat = (time: Date): string => {
    let hours = time.getHours().toString().padStart(2, '0');
    let minutes = time.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
}

export const DateAndTimeRangePicker = (props: IDateAndTimeRangePicker) => {
    const { increment, hourFormat } = props;
    const [datePickerDate, setDatePickerDate] = React.useState<Date>(props.timeFrom);
    const [timeFrom, setTimeFrom] = React.useState<string>('');
    const [timeTo, setTimeTo] = React.useState<string>('');

    React.useEffect(() => {
        const setDefaultTime = (timeFrom: Date, timeTo: Date) => {
            if (hourFormat === HourFormat.Hour24) {
                setTimeFrom(getTimeString24HourFormat(timeFrom));
                setTimeTo(getTimeString24HourFormat(timeTo));
            }

            if (hourFormat === HourFormat.Hour12) {
                setTimeFrom(getTimeString12HourFormat(timeFrom));
                setTimeTo(getTimeString12HourFormat(timeTo));
            }
        }

        setDefaultTime(props.timeFrom, props.timeTo);
    }, []);

    const options = React.useMemo(() => {
        const timeList = generateTimeList('00:00', increment, hourFormat);
        const dropdownOptions = timeList.map(time => ({ key: time, text: time }));
        return dropdownOptions;
    }, []);

    const onSelectDate = (selectedDate: Date | null | undefined) => {
        if (selectedDate) {
            let snappedTimeFrom = selectedDate;
            let snappedTimeTo = selectedDate;
            setDatePickerDate(selectedDate);
            if (timeFrom) {
                snappedTimeFrom = new Date(`${selectedDate.toDateString()} ${timeFrom}`);
            }

            if (timeTo) {
                snappedTimeTo = new Date(`${selectedDate.toDateString()} ${timeTo}`);
            }

            props.notifyOutputChanged(snappedTimeFrom, snappedTimeTo);
        }
    }

    const onChangeTimeFrom = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => {
        if (option) {
            setTimeFrom(option.text);
            const dateFrom = new Date(`${datePickerDate.toDateString()} ${option.text}`);
            const dateTo = new Date(`${datePickerDate.toDateString()} ${timeTo}`);
            props.notifyOutputChanged(dateFrom, dateTo);
        }
    }

    const onChangeTimeTo = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => {
        if (option) {
            setTimeTo(option.text);
            const dateFrom = new Date(`${datePickerDate.toDateString()} ${timeFrom}`);
            const dateTo = new Date(`${datePickerDate.toDateString()} ${option.text}`);
            props.notifyOutputChanged(dateFrom, dateTo);
        }
    }

    return (
        <Stack grow>
            <Stack horizontal verticalAlign='center' grow wrap styles={stackStyles}>
                <Stack.Item grow>
                    <DatePicker
                        className="customDatePicker"
                        placeholder="Select a date..."
                        formatDate={(date?: Date) => {
                            if (date) {
                                return date.toLocaleDateString();
                            }

                            return '';
                        }}
                        value={datePickerDate}
                        onSelectDate={onSelectDate}
                        ariaLabel="Date picker"
                        styles={{
                            root: { minWidth: 160, width: '100%', paddingRight: 5, paddingTop: 5 },
                        }}
                    />
                </Stack.Item>
                <Stack.Item grow>
                    <Stack grow horizontal wrap>
                        <Stack.Item grow>
                            <Dropdown
                                placeholder="From..."
                                selectedKey={timeFrom}
                                options={options}
                                styles={dropdownStyles}
                                onRenderCaretDown={() => {
                                    return (<Icon iconName="Clock" />);
                                }}
                                onRenderTitle={onRenderTitleFrom}
                                calloutProps={{ calloutMaxHeight: 300 }}
                                onChange={onChangeTimeFrom}
                            />
                        </Stack.Item>
                        <Stack.Item grow>
                            <Dropdown
                                placeholder="To..."
                                selectedKey={timeTo}
                                options={options}
                                styles={dropdownStyles}
                                onRenderCaretDown={() => {
                                    return (<Icon iconName="Clock" />);
                                }}
                                onRenderTitle={onRenderTitleTo}
                                calloutProps={{ calloutMaxHeight: 300 }}
                                onChange={onChangeTimeTo}
                            />
                        </Stack.Item>
                    </Stack>
                </Stack.Item>
            </Stack>
        </Stack>
    );
}