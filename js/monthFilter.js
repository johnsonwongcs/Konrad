function monthFilter() {
    return function (num) {
	    return Math.ceil(num);
	};

}
angular.module('MLB').filter('monthFilter', monthFilter);
