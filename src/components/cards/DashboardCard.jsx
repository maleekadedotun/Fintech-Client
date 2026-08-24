function DashboardCard({

    title,

    value,

    color,

    icon

}) {

    return (

        <div
            className=" 
                bg-white
                rounded-2xl
                shadow-md
                p-6
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

                    <p className="text-gray-500">

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
                        ${color}
                        text-white
                        w-14
                        h-14
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        text-2xl
                    `}
                >

                    {icon}

                </div>

            </div>

        </div>

    );

}

export default DashboardCard;