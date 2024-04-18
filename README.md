**Time Window Picker PCF Control**

This control is developed using the robust and versatile `@fluentui/react` library, leveraging the DatePicker and Dropdown components to provide a seamless user experience.
This control can be used in the scenario where a time range selection is required along with date selection. For example to input appointment/meeting time or arrival window, 
it requires to select date and start time and end time.

![image](https://github.com/D365NoteBook/Code-Components/assets/166216845/49247368-39bf-45f2-8e5d-a503d52c7386)

![image](https://github.com/D365NoteBook/Code-Components/assets/166216845/fdc5b0fa-3330-4fa5-9f5e-4802c1d2ee41)

![image](https://github.com/D365NoteBook/Code-Components/assets/166216845/9baa9019-6ac7-4e02-8a69-84ac35efff16)

![image](https://github.com/D365NoteBook/Code-Components/assets/166216845/87da567d-59da-418b-ba3d-4acbb8fdeeb6)


https://github.com/D365NoteBook/Code-Components/assets/166216845/e7ac56e9-4603-4e31-933a-8c29669199a0


**Features**

_Date Selection_

The control features a **DatePicker** component of @fluentui/react that allows users to easily select the date. The DatePicker provides a visual calendar interface, 
enabling users to navigate through months and years and pick a date with a simple click.

_Time Selection_

In addition to date selection, the control also facilitates the selection of the **start time** and **end time**. This is achieved through two Dropdown components, each populated with 
time slots (slots are configurable, default is 30 min) in a 24-hour format (configurable, it can be 12-hour format also).

**How to use the control**

Import the solution zip file into target dynamics environment and configure the control on the form using a date time field.
Provide following properties values for the control:

![image](https://github.com/D365NoteBook/Code-Components/assets/166216845/4e301cb3-0cf7-4a6b-8550-1e5680862b2c)


