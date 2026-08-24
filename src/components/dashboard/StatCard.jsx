import React from "react";

function StatCard({

    title,

    value,

    icon,

    color,

}) {

    return (

        <div
            className="
                bg-white

                rounded-2xl

                shadow-sm

                border

                border-slate-100

                p-6

                hover:shadow-lg

                transition
            "
        >

            <div
                className="
                    flex
                    justify-between
                    items-center
                "
            >

                <div>

                    <p
                        className="
                            text-slate-500
                            text-sm
                        "
                    >

                        {title}

                    </p>

                    <h2
                        className="
                            text-3xl
                            font-bold
                            mt-2
                        "
                    >

                        {value}

                    </h2>

                </div>

                <div
                    className={`
                        w-14
                        h-14

                        rounded-xl

                        flex
                        items-center
                        justify-center

                        text-white

                        ${color}
                    `}
                >

                    {icon}

                </div>

            </div>

        </div>

    );

}

export default StatCard;