
'use client';

export default function UpdateCard({ update_props }) {
    const { title, content,created_by ,is_important, created_at } = update_props;

    // border color 
    var borderColor = 'border-green-400';
    if (is_important) {
        borderColor = 'border-red-500';
    } 

    // date formatting
    const date = new Date(created_at);
    const onlyDate = date.toISOString().split("T")[0]; 

    return (
        <>
            <div
                className={`border-l-6 ${borderColor} bg-zinc-900 rounded-md p-4`}
            >
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        {is_important && (
                            <span className="text-red-400 text-2xl">●</span>
                        )}
                        {title}
                    </h2>
                    <span className="text-sm text-gray-400">
                        {onlyDate}
                    </span>
                </div>

                <p className="text-gray-300 text-sm ">
                    {content}
                </p>
                <p className="text-gray-500 text-xs">
                    Created by: {created_by}
                </p>

                
                {/* probably for later use */}
                {/* {priority === 'high' && (
                    <div className=" border mt-3 p-1 px-2 border-white rounded-full w-fit ">
                    <span className="inline-block  text-xs  font-semibold text-red-400">
                        IMPORTANT
                    </span>
                    </div>
                 
                )} */}
            </div>
        </>
    );
}
