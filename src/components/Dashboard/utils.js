import $ from "jquery";

export function updateDonutChart (el, percent, donut) {
  percent = Math.round(percent);
  if (percent > 100) {
      percent = 100;
  } else if (percent < 0) {
      percent = 0;
  }
  var deg = Math.round(360 * (percent / 100));

  if (percent > 50) {
      $(el + ' .pie').css('clip', 'rect(auto, auto, auto, auto)');
      $(el + ' .right-side').css('transform', 'rotate(180deg)');
  } else {
      $(el + ' .pie').css('clip', 'rect(0, 1em, 1em, 0.5em)');
      $(el + ' .right-side').css('transform', 'rotate(0deg)');
  }
  if (donut) {
      $(el + ' .right-side').css('border-width', '0.05em');
      $(el + ' .left-side').css('border-width', '0.05em');
      $(el + ' .shadow').css('border-width', '0.05em');
  } else {
      $(el + ' .right-side').css('border-width', '0.5em');
      $(el + ' .left-side').css('border-width', '0.5em');
      $(el + ' .shadow').css('border-width', '0.5em');
  }
  $(el + ' .num').text(percent);
  $(el + ' .sec').text(Math.floor((percent * 60)/100));
  $(el + ' .left-side').css('transform', 'rotate(' + deg + 'deg)');
}


export function dateDiff(date1, date2) {
    var diff = {}                           // Initialisation du retour
    var tmp = date2 - date1;

    tmp = Math.floor(tmp / 1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;                    // Extraction du nombre de secondes

    tmp = Math.floor((tmp - diff.sec) / 60);    // Nombre de minutes (partie entière)
    diff.min = tmp % 60;                    // Extraction du nombre de minutes

    tmp = Math.floor((tmp - diff.min) / 60);    // Nombre d'heures (entières)
    diff.hour = tmp % 24;                   // Extraction du nombre d'heures

    tmp = Math.floor((tmp - diff.hour) / 24);   // Nombre de jours restants
    diff.day = tmp;

    return diff;
}