﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.Appointments
{
    public class SoapNotes
    {
        public int Id { get; set; }
        public int AppointmentId { get; set; }
        public string Subjective { get; set; }
        public string Objective { get; set; }
        public string Assessment { get; set; }
        public string Plan { get; set; }

        public Appointment Appointment { get; set; }
    }
}
