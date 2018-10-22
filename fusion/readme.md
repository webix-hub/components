By MLukman (https://github.com/MLukman).

**FusionCharts require a licence**, so this integration assumes that you have one (or a trial version), to specify path to the folder as `cdn` property.

### Parameters:

- `cdn`
Absolute path to your FusionChart files. If set to false, it is expected that files were included on the page.
- `config`
The FusionCharts initialization config object
- `require`
Whether to load up additional JS files or not. Default:
```
{ charts: true, powercharts: false, widgets: false, gantt: false, maps: false } 
```
### Functions:

- `getChart()`
Gets the FusionCharts object