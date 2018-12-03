import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { chartVerticalBars } from '@asymmetrik/sentio';
import { ChartWrapper } from '../../util/chart-wrapper.util';
import { ResizeUtil } from '../../util/resize.util';
var VerticalBarChartDirective = /** @class */ (function () {
    function VerticalBarChartDirective(el) {
        // Chart Ready event
        this.chartReady = new EventEmitter();
        // Create the chart
        this.chartWrapper = new ChartWrapper(el, chartVerticalBars(), this.chartReady);
        // Set up the resizer
        this.resizeUtil = new ResizeUtil(el, this.resizeEnabled);
    }
    /**
     * For The vertical bar chart, we just resize width
     */
    VerticalBarChartDirective.prototype.setChartDimensions = function (dim, force) {
        if (force === void 0) { force = false; }
        var size;
        // If resize is enabled, we want to resize to parent
        if (this.resizeEnabled) {
            size = dim.parent;
        }
        // If resize isn't enabled but we're forcing resize, we want to resize to element
        else if (force) {
            size = dim.element;
        }
        if (null != size && null != size.width && this.chartWrapper.chart.width() !== size.width) {
            // pin the height to the width
            this.chartWrapper.chart
                .width(size.width)
                .resize();
        }
    };
    VerticalBarChartDirective.prototype.onResize = function (event) {
        this.resizeUtil.resizeObserver.next(event);
    };
    VerticalBarChartDirective.prototype.ngOnInit = function () {
        var _this = this;
        // Initialize the chart
        this.chartWrapper.initialize();
        // Set up the resize callback
        this.resizeUtil.resizeSource
            .subscribe(function () {
            // Do the resize operation
            _this.setChartDimensions(_this.resizeUtil.getSize());
            _this.chartWrapper.chart.redraw();
        });
        // Set the initial size of the chart
        this.setChartDimensions(this.resizeUtil.getSize(), true);
        this.chartWrapper.chart.redraw();
    };
    VerticalBarChartDirective.prototype.ngOnDestroy = function () {
        this.resizeUtil.destroy();
    };
    VerticalBarChartDirective.prototype.ngOnChanges = function (changes) {
        var resize = false;
        var redraw = false;
        if (changes['data']) {
            this.chartWrapper.chart.data(this.data);
            redraw = redraw || !changes['data'].isFirstChange();
        }
        if (changes['widthExtent']) {
            this.chartWrapper.chart.widthExtent().overrideValue(this.widthExtent);
            redraw = redraw || !changes['widthExtent'].isFirstChange();
        }
        if (changes['resizeEnabled']) {
            this.resizeUtil.enabled = this.resizeEnabled;
            resize = resize || (this.resizeEnabled && !changes['resizeEnabled'].isFirstChange());
            redraw = redraw || resize;
        }
        // Only redraw once if necessary
        if (resize) {
            this.chartWrapper.chart.resize();
        }
        if (redraw) {
            this.chartWrapper.chart.redraw();
        }
    };
    VerticalBarChartDirective.decorators = [
        { type: Directive, args: [{
                    selector: 'sentioVerticalBarChart'
                },] },
    ];
    /** @nocollapse */
    VerticalBarChartDirective.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    VerticalBarChartDirective.propDecorators = {
        data: [{ type: Input, args: ['sentioData',] }],
        widthExtent: [{ type: Input, args: ['sentioWidthExtent',] }],
        resizeEnabled: [{ type: Input, args: ['sentioResize',] }],
        duration: [{ type: Input, args: ['sentioDuration',] }],
        chartReady: [{ type: Output, args: ['sentioChartReady',] }],
        onResize: [{ type: HostListener, args: ['window:resize', ['$event'],] }]
    };
    return VerticalBarChartDirective;
}());
export { VerticalBarChartDirective };
//# sourceMappingURL=vertical-bar-chart.directive.js.map