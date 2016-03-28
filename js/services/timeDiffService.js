
    Puissance4app.factory("timeDiffService", function() {

        return {
            diff: function ($date1, $date2) {
               return Math.floor($date2.diff($date1,'milliseconds') / 1000) + 1;
            }
        }
    });
