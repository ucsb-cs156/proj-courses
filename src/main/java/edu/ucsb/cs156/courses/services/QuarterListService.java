package edu.ucsb.cs156.courses.services;

import java.util.ArrayList;
import java.util.List;

import edu.ucsb.cs156.courses.models.Quarter;


public class QuarterListService {
    /**
     * return a list of Quarters starting with the start parameter and ending with the end parameter, inclusive.
     *
     * The result will automatically go in chronological or reverse chronological order, depending
     * on the order of the parameters.
     * @param start
     * @param end
     * @return list of quarters in specified order
     */

    public static List<Quarter> quarterList(String start, String end) {
        List<Quarter> result = new ArrayList<Quarter>();

        int startInt = Quarter.qyyToQyyyy(start);
        int endInt = Quarter.qyyToQyyyy(end);

        if (startInt < endInt) {
            for (Quarter iter = new Quarter(startInt); iter.getValue() <= endInt; iter.increment()) {
                Quarter q = new Quarter(iter.getValue());
                result.add(q);
            }
        } else {
            for (Quarter iter = new Quarter(startInt); iter.getValue() >= endInt; iter.decrement()) {
            Quarter q = new Quarter(iter.getValue());
            result.add(q);
            }
        }
        return result;
    }
}
