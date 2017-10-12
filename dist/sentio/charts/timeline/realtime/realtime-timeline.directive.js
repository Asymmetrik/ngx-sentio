import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { chartRealtimeTimeline } from '@asymmetrik/sentio';
import { ChartWrapper } from '../../../util/chart-wrapper.util';
import { ResizeUtil } from '../../../util/resize.util';
import { TimelineUtil } from '../timeline.util';
var RealtimeTimelineDirective = /** @class */ (function () {
    function RealtimeTimelineDirective(el) {
        // Chart Ready event
        this.chartReady = new EventEmitter();
        // Interaction events
        this.markerMouseover = new EventEmitter();
        this.markerMouseout = new EventEmitter();
        this.markerClick = new EventEmitter();
        // Create the chart
        this.chartWrapper = new ChartWrapper(el, chartRealtimeTimeline(), this.chartReady);
        // Set up the resizer
        this.resizeUtil = new ResizeUtil(el, (this.resizeHeight || this.resizeWidth));
        this.timelineUtil = new TimelineUtil(this.chartWrapper);
    }
    RealtimeTimelineDirective.prototype.onResize = function (event) {
        this.resizeUtil.resizeObserver.next(event);
    };
    RealtimeTimelineDirective.prototype.ngOnInit = function () {
        var _this = this;
        // Initialize the chart
        this.chartWrapper.initialize();
        // register for the marker events
        this.chartWrapper.chart.dispatch().on('markerClick', function (p) { _this.markerClick.emit(p); });
        this.chartWrapper.chart.dispatch().on('markerMouseover', function (p) { _this.markerMouseover.emit(p); });
        this.chartWrapper.chart.dispatch().on('markerMouseout', function (p) { _this.markerMouseout.emit(p); });
        // Set up the resize callback
        this.resizeUtil.resizeSource
            .subscribe(function () {
            // Do the resize operation
            _this.timelineUtil.setChartDimensions(_this.resizeUtil.getSize(), _this.resizeWidth, _this.resizeHeight);
            _this.chartWrapper.chart.redraw();
        });
        // Set the initial size of the chart
        this.timelineUtil.setChartDimensions(this.resizeUtil.getSize(), this.resizeWidth, this.resizeHeight, true);
        this.chartWrapper.chart.redraw();
    };
    RealtimeTimelineDirective.prototype.ngOnDestroy = function () {
        this.resizeUtil.destroy();
    };
    RealtimeTimelineDirective.prototype.ngOnChanges = function (changes) {
        var resize = false;
        var redraw = false;
        if (changes['sentioData']) {
            this.chartWrapper.chart.data(this.data);
            redraw = redraw || !changes['sentioData'].isFirstChange();
        }
        if (changes['sentioSeries']) {
            this.chartWrapper.chart.series(this.series);
            redraw = redraw || !changes['sentioSeries'].isFirstChange();
        }
        if (changes['sentioMarkers']) {
            this.chartWrapper.chart.markers(this.markers);
            redraw = redraw || !changes['sentioMarkers'].isFirstChange();
        }
        if (changes['sentioYExtent']) {
            this.chartWrapper.chart.yExtent().overrideValue(this.yExtent);
            redraw = redraw || !changes['sentioYExtent'].isFirstChange();
        }
        if (changes['sentioXExtent']) {
            this.chartWrapper.chart.xExtent().overrideValue(this.xExtent);
            redraw = redraw || !changes['sentioXExtent'].isFirstChange();
        }
        if (changes['sentioFps']) {
            this.chartWrapper.chart.fps(this.fps);
        }
        if (changes['sentioDelay']) {
            this.chartWrapper.chart.delay(this.delay);
            redraw = redraw || !changes['sentioDelay'].isFirstChange();
        }
        if (changes['sentioInterval']) {
            this.chartWrapper.chart.interval(this.interval);
            redraw = redraw || !changes['sentioInterval'].isFirstChange();
        }
        // Only redraw once if necessary
        if (resize) {
            this.chartWrapper.chart.resize();
        }
        if (redraw) {
            this.chartWrapper.chart.redraw();
        }
    };
    RealtimeTimelineDirective.decorators = [
        { type: Directive, args: [{
                    selector: 'sentioRealtimeTimeline'
                },] },
    ];
    /** @nocollapse */
    RealtimeTimelineDirective.ctorParameters = function () { return [
        { type: ElementRef, },
    ]; };
    RealtimeTimelineDirective.propDecorators = {
        'data': [{ type: Input, args: ['sentioData',] },],
        'series': [{ type: Input, args: ['sentioSeries',] },],
        'markers': [{ type: Input, args: ['sentioMarkers',] },],
        'yExtent': [{ type: Input, args: ['sentioYExtent',] },],
        'xExtent': [{ type: Input, args: ['sentioXExtent',] },],
        'delay': [{ type: Input, args: ['sentioDelay',] },],
        'fps': [{ type: Input, args: ['sentioFps',] },],
        'interval': [{ type: Input, args: ['sentioInterval',] },],
        'resizeWidth': [{ type: Input, args: ['sentioResizeWidth',] },],
        'resizeHeight': [{ type: Input, args: ['sentioResizeHeight',] },],
        'chartReady': [{ type: Output, args: ['sentioChartReady',] },],
        'markerMouseover': [{ type: Output, args: ['sentioMarkerMouseover',] },],
        'markerMouseout': [{ type: Output, args: ['sentioMarkerMouseout',] },],
        'markerClick': [{ type: Output, args: ['sentioMarkerClick',] },],
        'onResize': [{ type: HostListener, args: ['window:resize', ['$event'],] },],
    };
    return RealtimeTimelineDirective;
}());
export { RealtimeTimelineDirective };
//# sourceMappingURL=realtime-timeline.directive.js.map