import { useQuery } from "react-query";
import axios from "axios";

export function useSystemInfo() {
  
  return useQuery("systemInfo", async () => {
    try {
      const response = await axios.get("/api/systemInfo");
      return response.data;
    } catch (e) {
      console.error("Error invoking axios.get: ", e);
      return {  
        springH2ConsoleEnabled: false,
        showSwaggerUILink: false,
        startQtrYYYYQ: "20221",
        endQtrYYYYQ: "20222"  
      };
    }
  }, {
    initialData: { 
      initialData:true, 
      springH2ConsoleEnabled: false,
      showSwaggerUILink: false,
      startQtrYYYYQ: "20221",
      endQtrYYYYQ: "20222"  
    }
  });

}
