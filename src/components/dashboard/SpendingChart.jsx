import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

function SpendingChart({

    credit,

    debit,

}) {

    const data = {

        labels: [

            "Income",

            "Expenses",

        ],

        datasets: [

            {

                data: [

                    credit,

                    debit,

                ],

                backgroundColor: [

                    "#10B981",

                    "#EF4444",

                ],

                borderWidth: 0,

            },

        ],

    };

    const options = {

        plugins: {

            legend: {

                position: "bottom",

            },

        },

        cutout: "70%",

    };

    return (

        <div className="bg-white rounded-3xl shadow-sm p-6">

            <h2 className="text-2xl font-bold mb-6">

                Spending Overview

            </h2>

            <Doughnut

                data={data}

                options={options}

            />

        </div>

    );

}

export default SpendingChart;