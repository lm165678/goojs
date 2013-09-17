define([
	'goo/statemachine/StateUtils'
],
/** @lends */

function(
	StateUtils
) {
	"use strict";

	/**
	 * @class
	 * @property {ArrayBuffer} data Data to wrap
	 */
	function TweenRotationAction(settings) {
		settings = settings || {};

		this.entity = settings.entity || null;
		this.time = settings.time || 2000;
		this.event = settings.event || 'dummy';
		this.from = settings.from || {
			x: 0,
			y: 0,
			z: 0
		};
		this.to = settings.to || {
			x: 0,
			y: 0,
			z: Math.PI * 2
		};
		this.easing = settings.easing || window.TWEEN.Easing.Elastic.InOut;
		this.tween = new window.TWEEN.Tween();

		this.external = [
			{ name: 'Entity', key: 'entity', type: 'entity' },
			{ name: 'Time', key: 'time', type: 'spinner' },
			{ name: 'Send event', key: 'event', type: 'event' },
			{ name: 'From', key: 'from', type: 'json' },
			{ name: 'To', key: 'to', type: 'json' },
			{ name: 'Easing', key: 'easing', type: 'function' }
		];
	}

	TweenRotationAction.prototype = {
		onCreate: function(fsm) {
			var that = this;
			this.tween.from(StateUtils.clone(this.from)).to(this.to, this.time).easing(this.easing).onUpdate(function() {
				if (that.entity !== null) {
					that.entity.transformComponent.transform.setRotationXYZ(this.x, this.y, this.z);
					that.entity.transformComponent.setUpdated();
				}
			}).onComplete(function() {
				fsm.handle(this.event);
				console.log('complete:', this.event);
			}.bind(this)).start();
		},
		onDestroy: function() {
			this.tween.stop();
		}
	};

	return TweenRotationAction;
});