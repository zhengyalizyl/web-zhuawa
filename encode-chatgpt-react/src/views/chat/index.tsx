const Index=()=>{
  const isMobile = true;
  return (
    <div className="flex flex-col h-full w-full">
      <main className="flex-1 overflow-hidden">
         <div  id="scrollRef" ref="scrollRef" className="h-full overfloe-hidden overflow-y-auto">
           <div
             className={
              `w-full max-w-screen-xl m-auto dark:bg-[#101014] ${isMobile ? 'p-2' : 'p-4'}`}
             >
              <div id="image-warpper" className="relative">
                  {!dataSource.length?(<div>
                        
                  </div>)}
              </div>
             </div>
         </div>
      </main>
      </div>
  )
}