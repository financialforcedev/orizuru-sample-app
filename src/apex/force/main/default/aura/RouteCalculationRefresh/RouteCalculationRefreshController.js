({
	handleStepEvent: function (component, event, helper) {
		var status = event.getParam('status');
		if (status == 'COMPLETED') {
			// set the status field to true

			window.setTimeout(
				$A.getCallback(function () {
					$A.get('e.force:refreshView').fire();
				}), 500
			);
		}
	}
});
