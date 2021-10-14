<template>
  <div class="timeline-viewer">
		<canvas id="timeline-canvas"/>
		<div id="timeline-legend" class="timeline-legend"/>
  </div>
</template>

<script lang="ts">
import { Activity, ActivityInterface } from '../Activities';
import { defineComponent, PropType } from 'vue';

const DISPLAY_NUM_DAYS = 7;

export default defineComponent({
  name: "timeline-viewer",
  data() {
		let now = new Date();
		let then = new Date().setDate(now.getDate() - DISPLAY_NUM_DAYS);
    return {
			performedActivities: [] as Array<Activity>,
			actRows: {} as Record<number, number>,
			actColors: {} as Record<number, string>,
			end: now.getTime(),
			rowCount: 0,
			start: then,
    };
  },
  methods: {
		drawActivities() {
			let canvas = document.getElementById('timeline-canvas') as HTMLCanvasElement;
			let ctxP = canvas.getContext('2d');
			if (!ctxP) {
				return;
			}
			let ctx = ctxP as CanvasRenderingContext2D;
			let activityMargin = 1;
			let activitySet = new Set(this.performedActivities.map(a => a.key));
			let activityHeight = canvas.height / activitySet.size - activityMargin;
			let activityWidth = (canvas.width / DISPLAY_NUM_DAYS) * 0.6;
			let timeScale = (canvas.width - activityWidth - activityMargin) / (this.end - this.start);
			this.performedActivities.forEach((a: Activity) => {
				ctx.fillStyle = this.getActivityColor(a);
				let row = this.getActivityRow(a);
				let aTop = row * (activityHeight + activityMargin);
				let beginX = (a.timestamp - this.start) * timeScale;
				ctx.fillRect(beginX, aTop, activityWidth, activityHeight);
				// TODO: draw x axis
			});

			// Draw legend
			// TODO: attach text
			// XXX limit redraws?
			let legend = document.getElementById('timeline-legend') as HTMLElement;
			legend.innerHTML = '';
			activitySet.forEach((a: number) => {
				// let row = this.getActivityRow(a);
				let div = document.createElement('div');
				div.innerHTML = `${this.activities.getActionName(a)}`;
				div.style.color = this.actColors[a];
				div.style.lineHeight = `${activityHeight}px`;
				div.style.margin = `${activityMargin}px`;
				div.style.border= `solid ${this.actColors[a]}`;
				div.style.borderWidth = `${activityMargin}px`;
				legend.appendChild(div);
			});
		},

		/*eslint-disable no-unused-vars */
		getActivityColor(a: Activity): string {
			let color = this.actColors[a.key];
			if (color === undefined) {
				color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
				this.actColors[a.key] = color;
			}
			return color;
		},

		/*eslint-disable no-unused-vars */
		getActivityRow(a: Activity): number {
			let row = this.actRows[a.key];
			if (row === undefined) {
				row = this.rowCount;
				this.rowCount += 1;
				this.actRows[a.key] = row;
			}
			return row;
		},
  },
	props: {
		activities: {
			type: Object as PropType<ActivityInterface>,
			required: true,
		}
	},
	beforeMount() {
		let tv = this;
		let maxEvents = 1000;

		this.activities.getActivities(this.start, this.end, maxEvents).
			then((data: Array<Activity>) => {
				tv.performedActivities = data;
				tv.drawActivities();
			})
			.catch((e: Error) => {
				// TODO: handle this
				console.error('get activity', e);
			});
	},
});
</script>

<style>
	.timeline-viewer {
		border: 2px solid #aaa;
		border-radius: 5px;
		box-shadow: 5px 5px 10px;
		background-color: #eee;
		display: flex;
		margin: 10px;
		padding: 10px;
	}
	.timeline-legend {
		background-color: #fff;
		margin: 10px;
	}
	button {
		margin: auto;
	}
	canvas {
		background-color: #fff;
		margin: 10px;
	}
</style>
