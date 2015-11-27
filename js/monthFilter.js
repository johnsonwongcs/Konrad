function monthFilter() {
    return function (num) {
	    return Math.ceil(num);
	};

}
angular.module('coderMdb').filter('monthFilter', monthFilter);
