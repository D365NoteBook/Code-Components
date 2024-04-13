import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import { DateAndTimeRangePicker, IDateAndTimeRangePicker } from "./components/DateAndTimeWindowPicker";

export class TimeWindowPicker implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private _notifyOutputChanged: () => void;
    private _timeFrom: Date;
    private _timeTo: Date;
    private _context: ComponentFramework.Context<IInputs>

    /**
     * Empty constructor.
     */
    constructor() { }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this._notifyOutputChanged = notifyOutputChanged;
        this._context = context;
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const timeFrom = this.correctTimeZoneForD365(context.parameters.timeFrom.raw || new Date());
        const timeTo = this.correctTimeZoneForD365(context.parameters.timeTo.raw || new Date());
        const increament = context.parameters.increment.raw || 30;
        const hourFormat = parseInt(context.parameters.hourFormat.raw) || 0;

        // const dateFrom = new Date(2024, 3, 11, 14, 0);
        // const dateTo = new Date(2024, 3, 11, 14, 0);

        const props: any = {
            timeFrom: timeFrom,
            timeTo: timeTo,
            increment: increament,
            hourFormat: hourFormat,
            notifyOutputChanged: this.notifyOutputChanged.bind(this)
        };

        return React.createElement(
            DateAndTimeRangePicker, props
        );
    }

    private correctTimeZoneForD365(
        date: Date | null): Date | null {
        if (date === null) return null;

        const TIMEZONE_INDEPENDENT_BEHAVIOR = 3;
        const fieldBehavior = this._context.parameters.timeFrom.attributes!.Behavior;
        const timezoneOffsetInMinutes = fieldBehavior === TIMEZONE_INDEPENDENT_BEHAVIOR
            ? 0
            : this._context.userSettings.getTimeZoneOffsetMinutes(date);

        const newDate = new Date(date).setMinutes(
            date.getMinutes() + date.getTimezoneOffset() + timezoneOffsetInMinutes);

        return new Date(newDate);
    }

    public notifyOutputChanged(timeFrom: Date, timeTo: Date) {
        this._timeFrom = timeFrom;
        this._timeTo = timeTo;
        this._notifyOutputChanged();
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {
            timeFrom: this._timeFrom,
            timeTo: this._timeTo
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
