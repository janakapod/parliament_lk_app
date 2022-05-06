import { WWW, TimeX } from "@nuuuwan/utils-js-dev";
import TimeXFuture, { SECONDS_IN } from "../base/TimeXFuture.js";

const URL_MP_LIST =
  "https://raw.githubusercontent.com/" +
  "nuuuwan/parliament_lk/data/" +
  "mp_list.json";

function cleanName(nameRaw) {
  return nameRaw.replace("Hon.", "").replace(", M.P.", "").trim();
}

export default class MP {
  constructor(d) {
    this.d = d;

    this.urlNum = parseInt(d.url_num);
    this.name = cleanName(d.name);
    this.imageURL = d.image_url;
    this.partyData = d.party;
    this.electoralDistrict = d.electoral_district;

    this.dateOfBirthData = d.date_of_birth;
    this.civilStatus = d.civil_status;
    this.religionData = d.religion;
    this.profession = d.profession;
    this.phone = d.phone;

    this.address = d.address;
    this.phoneSitting = d.phone_sitting;
    this.addressSitting = d.address_sitting;
    this.email = d.email;
    this.sourceURL = d.source_url;
  }

  get id() {
    return this.urlNum;
  }

  get party() {
    return this.partyData.split("(")[1].split(")")[0];
  }

  get dateOfBirth() {
    if (this.dateOfBirthData) {
      return this.dateOfBirthData;
    }
    const CUSTOM_DATE_OF_BIRTH = {
      1575: "27-04-1951", // Basil Rohana Rajapaksa
      3451: "01-10-1971", // Jagath Kumara Sumithraarachchi
      3364: "07-10-1974", // Lalith Varna Kumara
    };
    if (CUSTOM_DATE_OF_BIRTH[this.id]) {
      return CUSTOM_DATE_OF_BIRTH[this.id];
    }
    console.warn("No dateOfBirth for " + this.name + this.id);
    return "01-01-1970";
  }

  get age() {
    const utNow = TimeX.getUnixTime();
    const utDateOfBirth = TimeXFuture.parse(this.dateOfBirth);
    const age = (utNow - utDateOfBirth) / SECONDS_IN.YEAR;
    return age;
  }

  get isNationalList() {
    return this.electoralDistrict === "National List"
      ? "National List"
      : "Electoral Districts";
  }

  getAgeGroup(groupYears) {
    const age = this.age;
    const lower = Math.floor(age / groupYears) * groupYears;
    const upper = lower + groupYears;
    return `${lower} - ${upper}`;
  }

  isAgeOver(ageLimit) {
    if (this.age > ageLimit) {
      return `Age > ${ageLimit}`;
    }
    return `Age ≤ ${ageLimit}`;
  }

  get religion() {
    if (["Roman Catholicism", "Christianity"].includes(this.religionData)) {
      return "Christianity (All)";
    }

    if (!this.religionData || this.religionData === "Other") {
      return "Other or Unknown";
    }
    return this.religionData;
  }

  get isSinhalaBuddhist() {
    if (this.religion === "Buddhism") {
      return "Sinhala Buddhist";
    }
    if (this.religion === "Other or Unknown") {
      return "Other or Unknown";
    }
    return "Not Sinhala Buddhist";
  }

  static async getRawMPList() {
    return await WWW.json(URL_MP_LIST);
  }

  static async getMPList() {
    const mpRawList = await MP.getRawMPList();
    return mpRawList.map(function (d) {
      return new MP(d);
    });
  }

  static async getMPIdx() {
    const mpList = await MP.getMPList();
    return mpList.reduce(function (mpIdx, mp) {
      mpIdx[mp.id] = mp;
      return mpIdx;
    }, {});
  }
}