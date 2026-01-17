'use client';

export default function UpdateCard({ update_props }) {
    const { title, content, created_by, is_important, created_at } = update_props;

    // border color (ai shit again)
    var borderColor = 'border-purple-400';
    var glowColor = 'shadow-purple-500/50';
    var accentColor = 'text-purple-400';
    var bgAccent = 'bg-purple-500/10';
    var borderAccent = 'border-purple-500/50';
    if (is_important) {
        borderColor = 'border-pink-500';
        glowColor = 'shadow-pink-500/50';
        accentColor = 'text-pink-400';
        bgAccent = 'bg-pink-500/10';
        borderAccent = 'border-pink-500/50';
    }

    // date formatting
    const date = new Date(created_at);
    const onlyDate = date.toISOString().split("T")[0];

    return (
        <>
            <div
                className={`border-l-4 ${borderColor} bg-zinc-900/90 backdrop-blur-sm rounded-lg p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${glowColor} group`}
            >
                <div className="flex items-center justify-between mb-3">

                    {/* title and date */}
                    <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                        {is_important && (
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                            </span>
                        )}
                        {title}
                    </h2>
                    <span className="text-sm text-gray-400 bg-zinc-800/50 px-3 py-1 rounded-full">
                        {onlyDate}
                    </span>
                </div>

                
                <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                    {content}
                </p>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800">
                    <p className="text-gray-500 text-xs flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${is_important ? 'bg-pink-500' : 'bg-purple-500'}`}></span>
                        Created by: <span className={`${accentColor} font-medium`}>{created_by}</span>
                    </p>
                    
                    {/* might add later */}
                    {/* {is_important && (
                        <div className={`border ${borderAccent} ${bgAccent} px-3 py-1 rounded-full`}>
                            <span className={`text-xs font-semibold ${accentColor}`}>
                                IMPORTANT
                            </span>
                        </div>
                    )} */}
                </div>
            </div>
        </>
    );
}