export function WalletIllustration() {
  return (
    <svg
      className="wallet-illustration"
      viewBox="0 0 440 250"
      role="img"
      aria-label="Illustration of a green wallet, a coin, and leaves"
    >
      <defs>
        <linearGradient id="walletBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#087b55" />
          <stop offset="1" stopColor="#064b39" />
        </linearGradient>
        <linearGradient id="walletFlap" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#15996c" />
          <stop offset="1" stopColor="#08724f" />
        </linearGradient>
        <linearGradient id="coin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe77a" />
          <stop offset="1" stopColor="#f5a900" />
        </linearGradient>
      </defs>

      <ellipse cx="220" cy="220" rx="175" ry="25" fill="#bcebd6" opacity="0.32" />

      {/* Left sprig */}
      <path d="M112 224 C95 191 79 169 69 143" fill="none" stroke="#168d61" strokeWidth="3" strokeLinecap="round" />
      <path d="M91 181 C63 181 52 164 53 145 C75 147 91 160 91 181Z" fill="#51c98a" />
      <path d="M81 161 C52 157 42 137 48 119 C69 124 83 141 81 161Z" fill="#8de0b0" />
      <path d="M105 207 C78 204 67 188 69 171 C90 175 104 188 105 207Z" fill="#2fb777" />

      {/* Right sprig */}
      <path d="M328 225 C345 192 359 169 375 145" fill="none" stroke="#168d61" strokeWidth="3" strokeLinecap="round" />
      <path d="M354 184 C378 178 389 161 386 143 C365 148 353 164 354 184Z" fill="#4fc987" />
      <path d="M367 164 C393 153 399 133 390 117 C371 127 361 145 367 164Z" fill="#8de0b0" />
      <path d="M341 209 C365 202 375 184 369 168 C350 177 339 193 341 209Z" fill="#2fb777" />

      {/* Wallet body */}
      <path d="M116 99 L277 75 C288 73 297 80 300 91 L321 200 C323 210 317 218 307 220 L139 236 C128 237 120 230 118 219 L98 119 C96 109 104 101 116 99Z" fill="#053f31" opacity="0.16" />
      <path d="M113 104 L280 77 C291 75 300 82 302 93 L321 198 C323 208 317 215 307 217 L139 233 C128 234 120 228 118 217 L98 123 C96 113 103 106 113 104Z" fill="url(#walletBody)" />
      <path d="M107 112 L274 85 C285 83 294 89 296 100 L302 131 L116 161 L99 125 C95 118 99 114 107 112Z" fill="#15986d" />
      <path d="M109 113 L265 88 C276 86 285 91 288 101 L294 119 L121 148 L105 125 C101 119 103 115 109 113Z" fill="#0b664b" />
      <path d="M122 119 L258 96 C268 94 276 98 278 106 L282 117 L133 142Z" fill="#043f31" opacity="0.85" />
      <path d="M119 152 L299 124 L313 196 C315 204 310 210 302 211 L143 226 C134 227 128 222 126 214Z" fill="url(#walletFlap)" />
      <path d="M119 152 L299 124 L302 143 L123 170Z" fill="#25a97a" opacity="0.58" />
      <rect x="256" y="170" width="44" height="27" rx="9" transform="rotate(-8 256 170)" fill="#063f31" opacity="0.3" />
      <rect x="263" y="168" width="41" height="26" rx="8" transform="rotate(-8 263 168)" fill="#54c88e" />
      <circle cx="283" cy="181" r="4" fill="#d7f5e5" />

      {/* Coin */}
      <circle cx="296" cy="82" r="25" fill="#f6bd27" opacity="0.25" />
      <circle cx="296" cy="76" r="21" fill="url(#coin)" stroke="#e99b00" strokeWidth="2" />
      <circle cx="296" cy="76" r="15.5" fill="none" stroke="#fff1a7" strokeWidth="1.5" />
      <text x="296" y="84" textAnchor="middle" fontSize="23" fontWeight="700" fill="#fff9cf">$</text>
    </svg>
  );
}