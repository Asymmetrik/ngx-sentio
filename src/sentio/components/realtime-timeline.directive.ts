import { Directive, ElementRef, EventEmitter, HostListener, Input, OnChanges, SimpleChange, Output } from '@angular/core';
import * as sentio from '@asymmetrik/sentio';

import { BaseChartDirective } from './base-chart.directive';


@Directive({
	selector: 'realtime-timeline'
})
export class RealtimeTimelineDirective
	extends BaseChartDirective
	implements OnChanges {

	@Input() model: Object[];
	@Input() markers: Object[];
	@Input() yExtent: Object[];
	@Input() xExtent: Object[];
	@Input() delay: number;
	@Input() fps: number;
	@Input() interval: number;

	@Input() resizeWidth: boolean;
	@Input() resizeHeight: boolean;
	@Input() duration: number;

	@Input('configure') configureFn: (chart: any) => void;

	@Output() markerOver: EventEmitter<Object> = new EventEmitter();
	@Output() markerOut: EventEmitter<Object> = new EventEmitter();
	@Output() markerClick: EventEmitter<Object> = new EventEmitter();

	constructor(el: ElementRef) {
		super(el, sentio.realtime.timeline());
	}

	/**
	 * For the timeline, both dimensions scale independently
	 */
	setChartDimensions(width: number, height: number, force: boolean = false): void {
		let redraw: boolean = false;

		if ((force || this.resizeWidth) && null != this.chart.width) {
			if (null != width && this.chart.width() !== width) {
				this.chart.width(width);
				redraw = true;
			}
		}

		if ((force || this.resizeHeight) && null != this.chart.height) {
			if (null != height && this.chart.height() !== height) {
				this.chart.height(height);
				redraw = true;
			}
		}

		if (redraw) {
			this.chart.resize().redraw();
		}
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
		if (this.resizeHeight || this.resizeWidth) {
			this.delayResize();
		}
	}

	ngOnInit() {
		// Do the initial resize if either dimension is supposed to resize
		if (this.resizeHeight || this.resizeWidth) {
			this.resize();
		}

		// register for the marker events
		this.chart.dispatch().on('markerClick', (p: any) => { this.markerClick.emit(p); });
		this.chart.dispatch().on('markerMouseover', (p: any) => { this.markerOver.emit(p); });
		this.chart.dispatch().on('markerMouseout', (p: any) => { this.markerOut.emit(p); });

	}

	ngOnChanges(changes: { [key: string]: SimpleChange }) {

		let redraw: boolean = false;

		// Call the configure function
		if (changes['configureFn'] && changes['configureFn'].isFirstChange()
				&& null != changes['configureFn'].currentValue) {
			this.configureFn(this.chart);
		}

		if (changes['model']) {
			this.chart.data(changes['model'].currentValue);
			redraw = true;
		}
		if (changes['markers']) {
			this.chart.markers(changes['markers'].currentValue);
			redraw = true;
		}
		if (changes['yExtent']) {
			this.chart.yExtent().overrideValue(changes['yExtent'].currentValue);
			redraw = true;
		}
		if (changes['xExtent']) {
			this.chart.xExtent().overrideValue(changes['xExtent'].currentValue);
			redraw = true;
		}
		if (changes['duration']) {
			this.chart.duration(changes['duration'].currentValue);
		}

		if (changes['fps']) {
			this.chart.fps(changes['fps'].currentValue);
		}
		if (changes['delay']) {
			this.chart.delay(changes['delay'].currentValue);
			redraw = true;
		}
		if (changes['interval']) {
			this.chart.interval(changes['interval'].currentValue);
			redraw = true;
		}

		if (redraw) {
			this.chart.redraw();
		}
	}

}