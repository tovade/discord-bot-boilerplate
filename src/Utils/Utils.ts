import "moment-duration-format";
import moment from "moment-timezone";

export default class ClientUtils {
  formatSeconds(
    seconds: number,
    format = "Y [year] M [month] W [week] D [day] H [hour] m [minute] s [second]",
  ): string {
    const str = (moment.duration(seconds, "seconds") as any).format(format);
    const arr = str.split(" ");
    let newStr = "";
    arr.forEach((value: string, index: number) => {
      if (isNaN(parseInt(value))) return;
      const val = parseInt(value);
      if (val === 0) return;

      const nextIndex = arr[index + 1];
      newStr += `${value} ${nextIndex} `;
    });
    return newStr.trim();
  }
}
