export interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  firstVideoId?: string;
  notesUrl?: string;
  durationHours?: number;
}

export interface Category {
  id: string;
  title: string;
  playlists: Playlist[];
}

export interface Subject {
  id: string;
  title: string;
  categories: Category[];
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  subjects: Subject[];
}

export const EXAMS: Exam[] = [
  {
    "id": "jee",
    "title": "JEE (Main + Advanced)",
    "description": "Joint Entrance Examination for engineering aspirants in India.",
    "subjects": [
      {
        "id": "physics",
        "title": "Physics",
        "categories": [
          {
            "id": "mechanics",
            "title": "Mechanics",
            "playlists": [
              {
                "id": "PL_A4M5IAkMaev6ovGTwhfLLidWzCveoHZ",
                "title": "Mathematical Tools - IIT JEE Physics by Best Kota Faculty",
                "description": "Mohit Tyagi",
                "firstVideoId": "NAlLWcfQHrA",
                "notesUrl": "https://drive.google.com/drive/folders/1A_B_C_exampleDriveLink",
                "durationHours": 12.6
              },
              {
                "id": "PL_A4M5IAkMadyoou3Fl2jR0pG3X1Wi6xA",
                "title": "Rectilinear motion (Kinematics)",
                "description": "Mohit Tyagi",
                "firstVideoId": "CBvaO-uDvs8",
                "notesUrl": "https://drive.google.com/file/d/1aqp5ZVl8ZrH2gYcVslsfH76g7juDT6OD/view",
                "durationHours": 9.3
              },
              {
                "id": "PL_A4M5IAkMac_AeDfj1l85vp_93Dk_Agt",
                "title": "Projectile motion",
                "description": "Mohit Tyagi",
                "firstVideoId": "LuuBsJ0cdu8",
                "notesUrl": "https://drive.google.com/file/d/1aqp5ZVl8ZrH2gYcVslsfH76g7juDT6OD/view?usp=drive_link",
                "durationHours": 6.9
              },
              {
                "id": "PL_A4M5IAkMadzVrsTcZqRkeZ6SOko8pMd",
                "title": "Relative motion",
                "description": "Mohit Tyagi",
                "firstVideoId": "FQ37A9rf_cY",
                "notesUrl": "https://drive.google.com/file/d/1aqp5ZVl8ZrH2gYcVslsfH76g7juDT6OD/view?usp=drive_link",
                "durationHours": 8
              },
              {
                "id": "PL_A4M5IAkMadXu_0_nqUQAANlsPNxCM42",
                "title": "Newton's laws of motion",
                "description": "Mohit Tyagi",
                "firstVideoId": "e_h61PMKi6s",
                "notesUrl": "https://drive.google.com/file/d/1XGTYCr5gmff8aTiPXo3I9-FIMPx7_pYz/view",
                "durationHours": 12.9
              },
              {
                "id": "PL_A4M5IAkMafEN4paY3nfD2U3GsXSu_6F",
                "title": "Friction",
                "description": "Mohit Tyagi",
                "firstVideoId": "euR03xA3g2o",
                "notesUrl": "https://drive.google.com/file/d/1XGTYCr5gmff8aTiPXo3I9-FIMPx7_pYz/view",
                "durationHours": 6.4
              },
              {
                "id": "PL_A4M5IAkMaeMjUB_3Z26hU58Gsbwm4Ji",
                "title": "Circular motion",
                "description": "Mohit Tyagi",
                "firstVideoId": "fUgcbnkAewc",
                "notesUrl": "https://drive.google.com/file/d/1eZpZ1nbmEkQ1ynb3wzNWWw0y5dwaF8w7/view?usp=drive_link",
                "durationHours": 11
              },
              {
                "id": "PL_A4M5IAkMadTDfU4hJ23tdPqIwV-v6io",
                "title": "Work, Power and Energy (WPE)",
                "description": "Mohit Tyagi",
                "firstVideoId": "whAErnheTQI",
                "notesUrl": "https://drive.google.com/file/d/15v-H3ARE-RqOq53T9XqM-WEONdnLEPuk/view?usp=drive_link",
                "durationHours": 12.4
              },
              {
                "id": "PL_A4M5IAkMad-bxE6Fu7wyp_wyUcctCmU",
                "title": "Centre of Mass - Class 11 - Playlist | JEE Mains & Advanced",
                "description": "Mohit Tyagi",
                "firstVideoId": "YtwAOXtCSJs",
                "notesUrl": "https://drive.google.com/file/d/1JIkz-Q-ai-O4N9hWQhcQjbUonohYnu8o/view?usp=drive_link",
                "durationHours": 16.9
              },
              {
                "id": "PL_A4M5IAkMacVaetkKqlCBstwK7TdjOa9",
                "title": "Rotational dynamics | Rigid Body Dynamics | RBD",
                "description": "Mohit Tyagi",
                "firstVideoId": "QeXxp0EoWIY",
                "notesUrl": "https://drive.google.com/file/d/1cTIpFX6OErW7tJdMw76TOCEWaiTZlNQO/view?usp=drive_link",
                "durationHours": 26.2
              }
            ]
          },
          {
            "id": "thermodynamics",
            "title": "Thermodynamics",
            "playlists": [
              {
                "id": "PL_A4M5IAkMaegSCELKLq7FFLhYJdVIL87",
                "title": "Kinetic theory of gases| KTG",
                "description": "YouTube",
                "firstVideoId": "-CIvxHs5aIU",
                "notesUrl": "https://drive.google.com/file/d/1pm0VA1nVasqokBmRzQjsb5k7lo7YCGjf/view?usp=drive_link",
                "durationHours": 5
              },
              {
                "id": "PL_A4M5IAkMadOzxKmO5t223TkLNxCt2Vn",
                "title": "Thermodynamics - Class 11 | JEE Mains & Advanced",
                "description": "YouTube",
                "firstVideoId": "Rq5t4VQlmHk",
                "notesUrl": "https://drive.google.com/file/d/1iJukIEhFu0rP74-EiU6mEgj0sx9l1tmj/view?usp=drive_link",
                "durationHours": 7.8
              },
              {
                "id": "PLkC6TX8OQWIH2uKZ_mG_eQWn5DZ3shnGZ",
                "title": "thermal expansion| mohit tyagi",
                "description": "YouTube",
                "firstVideoId": "i43jeLbp5Tc",
                "notesUrl": "https://drive.google.com/file/d/1Lnn4mLqtK5PIz2Kv7GG1Wt90IOeFsINS/view?usp=drive_link",
                "durationHours": 6.2
              },
              {
                "id": "PL_A4M5IAkMadCqEDGWpPY-ScpPMZpVHqK",
                "title": "Heat transfer|",
                "description": "YouTube",
                "firstVideoId": "L-Cw_S_P7NA",
                "notesUrl": "https://drive.google.com/file/d/1JfwXyA6ANor-j2FvZWfdLyz5N_rEDLdO/view?usp=drive_link",
                "durationHours": 9.6
              }
            ]
          },
          {
            "id": "waves",
            "title": "Waves, Oscillations % Fluids",
            "playlists": [
              {
                "id": "PL_A4M5IAkMaclEO9yS-dyifDyAxIOqmTa",
                "title": "Simple harmonic motion| Oscillatory motion| SHM",
                "description": "Mohit Tyagi",
                "firstVideoId": "IXjhPmfPEDo",
                "notesUrl": "https://drive.google.com/file/d/1_gf4MF3wP31sNpSvgyaXGJXPmf9iNlIO/view?usp=drive_link",
                "durationHours": 15
              },
              {
                "id": "PL_A4M5IAkMafu-f7-CE7JXlzyi-l3FEfk",
                "title": "Wave on string| Physics| Class11",
                "description": "Mohit Tyagi",
                "firstVideoId": "I-XamepaGNE",
                "notesUrl": "https://drive.google.com/file/d/1dMEFAoXjS1gWAGETSOUMTizDas9rYXTM/view?usp=sharing",
                "durationHours": 14.1
              },
              {
                "id": "PL_A4M5IAkMac9yFGuvQIRmEDIdGaf-wRk",
                "title": "Sound waves| Waves| Physics| Class11",
                "description": "Mohit Tyagi",
                "firstVideoId": "Aqm9vjYFWgQ",
                "notesUrl": "https://www.scribd.com/document/749229679/Sound-Waves-Notes-ABJ-Sir",
                "durationHours": 17.5
              },
              {
                "id": "PL_A4M5IAkMac8lrmOeJ3yuiqPPNXxnh6Q",
                "title": "Wave optics| Light waves| Physics| Class 12",
                "description": "Mohit Tyagi",
                "firstVideoId": "oY3Iqz06Zh8",
                "notesUrl": "https://drive.google.com/file/d/1kRNLdHaMAa651wQ5lXQ69tcukaWQ9udn/view",
                "durationHours": 14.7
              },
              {
                "id": "PL_A4M5IAkMacuWACFhY1HSZAfZlwml0X4",
                "title": "Fluid mechanics| Physics| Class 11th",
                "description": "YouTube",
                "firstVideoId": "i7CPDh0i6u4",
                "notesUrl": "https://drive.google.com/file/d/15mdejWV3TPOEwvVTX71r6p6DtdTO5SYm/view",
                "durationHours": 12.7
              },
              {
                "id": "PLOo5vojAiF54Qp0nPQi-bgKqSMyLmu6m5",
                "title": "Viscosity, Surface Tension and Elasticity Abj sir",
                "description": "YouTube",
                "firstVideoId": "-7Fk3UXlQ4o",
                "notesUrl": "https://drive.google.com/file/d/15mdejWV3TPOEwvVTX71r6p6DtdTO5SYm/view",
                "durationHours": 10
              }
            ]
          },
          {
            "id": "electrodynamics",
            "title": "Electrodynamics",
            "playlists": [
              {
                "id": "PL_A4M5IAkMae_Hntw2myU3dHQ417zcxn6",
                "title": "Electrostatics Class 12 - Playlist | JEE Mains & Advanced",
                "description": "Mohit Tyagi",
                "firstVideoId": "hbj6jmVmwMg",
                "notesUrl": "https://drive.google.com/file/d/1wxv1c1942BG9E9Bm7QbChnEEDKdUP7w-/view?usp=drive_link",
                "durationHours": 31.8
              },
              {
                "id": "PLzMBx3jQSsI2xAxxdBNsSAgw9VAGyYKI1",
                "title": "Conductors",
                "description": "YouTube",
                "firstVideoId": "vJ7P1xWNVJc",
                "notesUrl": "https://drive.google.com/drive/folders/1YgjkUhVUGacci_dYU3MX40ZMdmlhzG4I",
                "durationHours": 6.2
              },
              {
                "id": "PL_A4M5IAkMaeGEjLX2pJU-qqnPcyjpBiV",
                "title": "Gravitation Class 11 - Playlist | JEE Mains & Advanced",
                "description": "Mohit Tyagi",
                "firstVideoId": "m0uC71rC9VY",
                "notesUrl": "https://drive.google.com/file/d/15MUnUui8qXSSVyKXpv3LoB-rIXaX--CR/view?usp=drive_link",
                "durationHours": 7.2
              },
              {
                "id": "PL_A4M5IAkMaf4jTvOb0KoK4jmcZKw386A",
                "title": "Capacitor Class 12 - Playlist | JEE Mains & Advanced",
                "description": "Mohit Tyagi",
                "firstVideoId": "vae4QvVAxqw",
                "notesUrl": "https://drive.google.com/file/d/1wsZVp_IkK9AHsbsrOYEi882D7KgKmbyC/view?usp=drive_link",
                "durationHours": 14.8
              },
              {
                "id": "PL_A4M5IAkMafFQcF0bW3sccrtnGx0FXO2",
                "title": "Current Electricity Class 12 - Playlist | JEE Mains & Advanced",
                "description": "Mohit Tyagi",
                "firstVideoId": "5A9zUX_Um68",
                "notesUrl": "https://drive.google.com/file/d/1PL0kgiQhuHu9Rvamhu5OWpGRmQxt6Vhn/view?usp=sharing",
                "durationHours": 18.1
              },
              {
                "id": "PL_A4M5IAkMadhXJKhZnVuDeO_0UAaqIXB",
                "title": "Electromagnetic forces| EMF| Magnetism",
                "description": "YouTube",
                "firstVideoId": "IybYHjqKSeg",
                "notesUrl": "https://drive.google.com/file/d/174whQASeU1S8YUfA860y07EfpJfdOez-/view?usp=drive_link",
                "durationHours": 14.2
              },
              {
                "id": "PL_A4M5IAkMacf--9QU-ep-YmRHc3e2_6v",
                "title": "Magnetic effect of current| Magnetism",
                "description": "Mohit Tyagi",
                "firstVideoId": "GLwj8ufICQI",
                "notesUrl": "https://drive.google.com/file/d/174whQASeU1S8YUfA860y07EfpJfdOez-/view?usp=drive_link",
                "durationHours": 9.8
              },
              {
                "id": "PLzMBx3jQSsI0u2zYhgjIoW9C_PN0wzSID",
                "title": "Magnetism of matter",
                "description": "YouTube",
                "firstVideoId": "a2l6Nxhewbg",
                "notesUrl": "https://drive.google.com/file/d/1i_s-geCopJA3fo366tFfwblgi_roLJ20/view?usp=drive_link",
                "durationHours": 5
              },
              {
                "id": "PL_A4M5IAkMadVthpkQ-MUWN5ldV_BO8op",
                "title": "Electromagnetic Induction| EMI",
                "description": "YouTube",
                "firstVideoId": "z1h9OHfvppI",
                "notesUrl": "https://drive.google.com/file/d/1oVSTC6ishsPHFgGgUNa0yXJIcf7A5_bE/view?usp=drive_link",
                "durationHours": 21.3
              },
              {
                "id": "PL_A4M5IAkMafg7ZUZZpXS8mGSBP49fjl3",
                "title": "Alternating current| Class 12| Physics",
                "description": "Mohit Tyagi",
                "firstVideoId": "FhsfZkvshs8",
                "notesUrl": "https://drive.google.com/file/d/1YBR5O_MU-ALE2fk1eFZeCQKWV6N80tUV/view?usp=drive_link",
                "durationHours": 7.3
              },
              {
                "id": "PLzMBx3jQSsI3YQ8rc9gTI-P0PVWE8MC2b",
                "title": "EM Waves",
                "description": "YouTube",
                "firstVideoId": "cu1wAP1ApJg",
                "notesUrl": "https://drive.google.com/file/d/1aCyP59AGfHTTIHhSn_i5WimF_VI2ByM7/view?usp=drive_link",
                "durationHours": 4.7
              }
            ]
          },
          {
            "id": "optics-modern-physics",
            "title": "Optics & Modern Physics",
            "playlists": [
              {
                "id": "PL_A4M5IAkMaeXk9ukLRM-SS-b3e18SMwj",
                "title": "Geometrical Optics and Ray Optics-Physics Free Lectures for IIT-JEE Main and Advance",
                "description": "YouTube",
                "firstVideoId": "mffkVI7W-z8",
                "notesUrl": "https://drive.google.com/file/d/13cCgKrS3rKlwZGvtYgrIBw0cOCzDRrCa/view?usp=sharing",
                "durationHours": 29.2
              },
              {
                "id": "PL_A4M5IAkMadpiaxmDasoChFugiq6K53N",
                "title": "Semiconductors| Electronics| Electronic devices",
                "description": "Mohit Tyagi",
                "firstVideoId": "0LkWXIg_E6g",
                "notesUrl": "",
                "durationHours": 11
              },
              {
                "id": "PLzMBx3jQSsI2XHwX_DWh1Kop1Udis8muG",
                "title": "Communication System",
                "description": "YouTube",
                "firstVideoId": "Z8_iwVGcpjA",
                "notesUrl": "",
                "durationHours": 2.9
              },
              {
                "id": "PL_A4M5IAkMadYqzTASKdG_r2YQ2XP8-o9",
                "title": "Bohr's model| Atomic structure| Modern Physics-1",
                "description": "Mohit Tyagi",
                "firstVideoId": "gIqlZoHJPFY",
                "notesUrl": "https://drive.google.com/file/d/17bP9mTkKABAbNeNmrAmrERSA6WYee5F4/view?usp=drive_link",
                "durationHours": 9.8
              },
              {
                "id": "PL_A4M5IAkMafsz-lLF3hcCPa3ntZegP-s",
                "title": "Photoelectric Effect| Modern Physics-1",
                "description": "Mohit Tyagi",
                "firstVideoId": "B3v_Muo-SF0",
                "notesUrl": "https://drive.google.com/file/d/17XJkew5NlvEWveC88A0zWKUNnTMRmgh9/view?usp=drive_link",
                "durationHours": 8.2
              },
              {
                "id": "PLzMBx3jQSsI0owcTTezf2ViTZHbk5LrbR",
                "title": "X-Ray",
                "description": "YouTube",
                "firstVideoId": "CNwXWzVK0xY",
                "notesUrl": "https://drive.google.com/file/d/17Y3f6ifpvTiUdWDSCcBMpl7ugylsxi-d/view?usp=drive_link",
                "durationHours": 3.5
              },
              {
                "id": "PL_A4M5IAkMad1pjDKqz6DZuH32ynVQjqh",
                "title": "Nuclear Physics| Modern Physics-2| Physics| Class12",
                "description": "YouTube",
                "firstVideoId": "7BsAWMavP6Q",
                "notesUrl": "https://drive.google.com/file/d/17c-eV6KXascnemkqMGYgU2BZSckxnTKz/view?usp=drive_link",
                "durationHours": 14.2
              }
            ]
          }
        ]
      },
      {
        "id": "maths",
        "title": "Mathematics",
        "categories": [
          {
            "id": "linear-algebra",
            "title": "Linear Algebra",
            "playlists": [
              {
                "id": "PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
                "title": "Essence of linear algebra",
                "description": "3Blue1Brown",
                "firstVideoId": "fNk_zzaMoSs",
                "durationHours": 3
              }
            ]
          }
        ]
      },
      {
        "id": "chemistry",
        "title": "Chemistry",
        "categories": []
      }
    ]
  },
  {
    "id": "neet",
    "title": "NEET",
    "description": "National Eligibility cum Entrance Test for medical aspirants.",
    "subjects": [
      {
        "id": "physics",
        "title": "Physics",
        "categories": []
      },
      {
        "id": "chemistry",
        "title": "Chemistry",
        "categories": []
      },
      {
        "id": "biology",
        "title": "Biology",
        "categories": []
      }
    ]
  },
  {
    "id": "cat",
    "title": "CAT / MBA",
    "description": "Common Admission Test for MBA aspirants.",
    "subjects": [
      {
        "id": "quants",
        "title": "Quantitative Aptitude",
        "categories": [
          {
            "id": "vedic-maths",
            "title": "Vedic Mathematics",
            "playlists": [
              {
                "id": "PLVLoWQFkZbhVeoqYRKydLyXanZQdQXjCv",
                "title": "Vedic Maths Complete Course By Disha Ma'am | Fast Calculation Tricks | All Topics | For All Classes",
                "description": "YouTube",
                "firstVideoId": "uoj2wGXYvDk",
                "durationHours": 6.5
              }
            ]
          }
        ]
      },
      {
        "id": "varc",
        "title": "Verbal Ability & RC",
        "categories": []
      },
      {
        "id": "dilr",
        "title": "Data Interpretation & LR",
        "categories": []
      }
    ]
  },
  {
    "id": "upsc",
    "title": "UPSC / Civil Services",
    "description": "Union Public Service Commission examinations.",
    "subjects": [
      {
        "id": "gs1",
        "title": "General Studies I",
        "categories": []
      },
      {
        "id": "gs2",
        "title": "General Studies II (Polity)",
        "categories": []
      },
      {
        "id": "gs3",
        "title": "General Studies III (Economy)",
        "categories": []
      },
      {
        "id": "gs4",
        "title": "Ethics",
        "categories": []
      }
    ]
  },
  {
    "id": "gate",
    "title": "GATE",
    "description": "Graduate Aptitude Test in Engineering.",
    "subjects": [
      {
        "id": "cse",
        "title": "Computer Science",
        "categories": []
      },
      {
        "id": "ece",
        "title": "Electronics & Communication",
        "categories": []
      },
      {
        "id": "mech",
        "title": "Mechanical Engineering",
        "categories": []
      },
      {
        "id": "civil",
        "title": "Civil Engineering",
        "categories": []
      }
    ]
  },
  {
    "id": "boards",
    "title": "Class 11 / 12 Boards",
    "description": "CBSE and State Board preparation.",
    "subjects": [
      {
        "id": "physics",
        "title": "Physics",
        "categories": []
      },
      {
        "id": "chemistry",
        "title": "Chemistry",
        "categories": []
      },
      {
        "id": "maths",
        "title": "Mathematics",
        "categories": []
      },
      {
        "id": "biology",
        "title": "Biology",
        "categories": []
      },
      {
        "id": "english",
        "title": "English",
        "categories": []
      }
    ]
  }
];
