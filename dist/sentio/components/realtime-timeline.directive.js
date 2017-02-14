var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import * as sentio from '@asymmetrik/sentio';
import { ChartWrapper } from '../util/chart-wrapper.util';
import { ResizeUtil } from '../util/resize.util';
var RealtimeTimelineDirective = (function () {
    function RealtimeTimelineDirective(el) {
        // Chart Ready event
        this.chartReady = new EventEmitter();
        // Interaction events
        this.markerOver = new EventEmitter();
        this.markerOut = new EventEmitter();
        this.markerClick = new EventEmitter();
        // Create the chart
        this.chartWrapper = new ChartWrapper(el, sentio.chart.realtimeTimeline(), this.chartReady);
        // Set up the resizer
        this.resizeUtil = new ResizeUtil(el, (this.resizeHeight || this.resizeWidth));
    }
    /**
     * For the timeline, both dimensions scale independently
     */
    RealtimeTimelineDirective.prototype.setChartDimensions = function (dim) {
        var resize = false;
        if (null != dim.width && this.chartWrapper.chart.width() !== dim.width) {
            // pin the height to the width
            this.chartWrapper.chart
                .width(dim.width);
            resize = true;
        }
        if (null != dim.height && this.chartWrapper.chart.height() !== dim.height) {
            // pin the height to the width
            this.chartWrapper.chart
                .height(dim.height);
            resize = true;
        }
        if (resize) {
            this.chartWrapper.chart.resize();
        }
    };
    RealtimeTimelineDirective.prototype.onResize = function (event) {
        this.resizeUtil.resizeObserver.next(event);
    };
    RealtimeTimelineDirective.prototype.ngOnInit = function () {
        var _this = this;
        // Initialize the chart
        this.chartWrapper.initialize();
        // register for the marker events
        this.chartWrapper.chart.dispatch().on('markerClick', function (p) { _this.markerClick.emit(p); });
        this.chartWrapper.chart.dispatch().on('markerMouseover', function (p) { _this.markerOver.emit(p); });
        this.chartWrapper.chart.dispatch().on('markerMouseout', function (p) { _this.markerOut.emit(p); });
        // Set up the resize callback
        this.resizeUtil.resizeSource
            .subscribe(function () {
            // Do the resize operation
            _this.setChartDimensions(_this.resizeUtil.getSize());
            _this.chartWrapper.chart.redraw();
        });
        // Set the initial size of the chart
        this.setChartDimensions(this.resizeUtil.getSize());
        this.chartWrapper.chart.redraw();
    };
    RealtimeTimelineDirective.prototype.ngOnDestroy = function () {
        this.resizeUtil.destroy();
    };
    RealtimeTimelineDirective.prototype.ngOnChanges = function (changes) {
        var resize = false;
        var redraw = false;
        if (changes['model']) {
            this.chartWrapper.chart.data(this.model);
            redraw = redraw || !changes['model'].isFirstChange();
        }
        if (changes['markers']) {
            this.chartWrapper.chart.markers(this.markers);
            redraw = redraw || !changes['markers'].isFirstChange();
        }
        if (changes['yExtent']) {
            this.chartWrapper.chart.yExtent().overrideValue(this.yExtent);
            redraw = redraw || !changes['yExtent'].isFirstChange();
        }
        if (changes['xExtent']) {
            this.chartWrapper.chart.xExtent().overrideValue(this.xExtent);
            redraw = redraw || !changes['xExtent'].isFirstChange();
        }
        if (changes['fps']) {
            this.chartWrapper.chart.fps(this.fps);
        }
        if (changes['delay']) {
            this.chartWrapper.chart.delay(this.delay);
            redraw = redraw || !changes['delay'].isFirstChange();
        }
        if (changes['interval']) {
            this.chartWrapper.chart.interval(this.interval);
            redraw = redraw || !changes['interval'].isFirstChange();
        }
        // Only redraw once if necessary
        if (resize) {
            this.chartWrapper.chart.resize();
        }
        if (redraw) {
            this.chartWrapper.chart.redraw();
        }
    };
    return RealtimeTimelineDirective;
}());
__decorate([
    Input(),
    __metadata("design:type", Array)
], RealtimeTimelineDirective.prototype, "model", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], RealtimeTimelineDirective.prototype, "markers", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], RealtimeTimelineDirective.prototype, "yExtent", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], RealtimeTimelineDirective.prototype, "xExtent", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], RealtimeTimelineDirective.prototype, "delay", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], RealtimeTimelineDirective.prototype, "fps", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], RealtimeTimelineDirective.prototype, "interval", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], RealtimeTimelineDirective.prototype, "resizeWidth", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], RealtimeTimelineDirective.prototype, "resizeHeight", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], RealtimeTimelineDirective.prototype, "chartReady", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], RealtimeTimelineDirective.prototype, "markerOver", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], RealtimeTimelineDirective.prototype, "markerOut", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], RealtimeTimelineDirective.prototype, "markerClick", void 0);
__decorate([
    HostListener('window:resize', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RealtimeTimelineDirective.prototype, "onResize", null);
RealtimeTimelineDirective = __decorate([
    Directive({
        selector: 'sentioRealtimeTimeline'
    }),
    __metadata("design:paramtypes", [ElementRef])
], RealtimeTimelineDirective);
export { RealtimeTimelineDirective };

//# sourceMappingURL=realtime-timeline.directive.js.map
