# Overview
A JavaScript library for Power Apps portals (previously Microsoft CRM Portals). To write basic functions like show and hide in Power Apps portals, we need to rely on jQuery for extensive manipuliation of DOM. The library provides these functionality in simple, clear and readable syntaxes. The library will help developers who are familar with Power Apps client script.

# Command samples
## Get value of a field
```
Xrm.Portal.Form.get(fieldName).getValue();
```
## Get JSON data from a quick view
```
Xrm.Portal.Form.get(quickViewName).getValue();
```
## Set value of a field
```
Xrm.Portal.Form.get(fieldName).setValue(object);
Xrm.Portal.Form.get(fieldName).setValue(id, name, entityLogicalName); //For lookup
```
## Show/hide a field
```
Xrm.Portal.Form.get(fieldName).setVisible(bool);
```
## Disable/enable a field
```
Xrm.Portal.Form.get(fieldName).setDisable(bool);
```
## Set required of a field
```
Xrm.Portal.Form.get(fieldName).setRequired(bool); //Default - a default validation and a default message
Xrm.Portal.Form.get(fieldName).setRequired(bool, function, message); //A custom validation and a custom message
```
## Configure DateTimePicker options
```
Xrm.Portal.Form.get(dateTimeFieldName).getData().options({options});
Xrm.Portal.Form.get(dateTimeFieldName).getData().options({ sideBySide: true}); //To show date component and time component side by side
Xrm.Portal.Form.get(dateTimeFieldName).getData().minDate(new Date()); //To disable selecting past date
```
Refer to more options [here](https://getdatepicker.com/4/)
## Get a row count from current page of the sub-grid
```
Xrm.Portal.Form.get(subGridName).getRowCountFromCurrentPage();
```
## Attach/Remove OnChange event of a field
```
Xrm.Portal.Form.get(fieldName).attachOnChange(callback);
Xrm.Portal.Form.get(fieldName).removeOnChange();
```
## Method chaining
```
Xrm.Portal.Form.get(fieldName).setValue(object).setVisible(bool).setRequired(bool);
```
## Validations
### Regular Expressions
```
Xrm.Portal.Form.Validation.assertRegex(fieldName, RegEx, message, [isRequired])
```
### Block past date
```
Xrm.Portal.Form.Validation.denyPastDate(fieldName, message, [isRequired])
```

### Block future date
```
Xrm.Portal.Form.Validation.denyFutureDate(fieldName, message, [isRequired])
```

### Compare main and sub. Main must be later than sub.
```
Xrm.Portal.Form.Validation.compareDates(mainFieldName, subFieldName, message, [isRequired])
```

### Set range to number
```
Xrm.Portal.Form.Validation.setNumberRange(fieldName, min, max, message, [isRequired])
```

## User
```
Xrm.Portal.User.getAsync() => promise
```

## Transform text fields to canvas
The method transforms a text field into a canvas, allowing users to draw lines or sign. Base64 string of canvas will be set to the underlying text field.
```
Xrm.Portal.Form.get(fieldName).transformToCanvas();
```
