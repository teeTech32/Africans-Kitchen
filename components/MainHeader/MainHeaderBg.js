export default function MainHeaderBg(){
  
  return<div className="header-background">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop
                  offset="0%"
                  style={{ stopColor: '#E48E1A', stopOpacity: '1' }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: '#FFBF00', stopOpacity: '1' }}
                />
              </linearGradient>
            </defs>
            <path
              fill="url(#gradient)"
              d="M0,240L88,200C160,170,290,130,410,130C510,120,620,170,740,170C940,170,1010,120,1140,120C1220,120,1340,150,1440,240L1440,0L0,0Z"
            ></path>
          </svg>
        </div>
}