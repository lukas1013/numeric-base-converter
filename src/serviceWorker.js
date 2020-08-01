export default function register() {
	if ('serviceWorker' in navigator) {
		window.onload = function() {
			navigator.serviceWorker.register('/service-worker.js')
				.catch(() => {
					console.log('The service worker could not be registered');
				});
		}
	}
}