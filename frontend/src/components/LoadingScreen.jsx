import { useEffect, useRef, useState } from 'react'

export default function LoadingScreen({ onEnter }) {
  const cvRef = useRef(null)
  const [btnVisible, setBtnVisible] = useState(false)

  useEffect(() => {
    const cv = cvRef.current
    const ctx = cv.getContext('2d')
    const W = 240, H = 240, CX = 120, CY = 120

    const EL = [
      { name:'fire',  col:'#EF4444', gl:'rgba(239,68,68,',  startA: Math.PI * 1.5 },
      { name:'water', col:'#3B82F6', gl:'rgba(59,130,246,', startA: Math.PI },
      { name:'earth', col:'#10B981', gl:'rgba(16,185,129,', startA: 0 },
      { name:'air',   col:'#A78BFA', gl:'rgba(167,139,250,',startA: Math.PI * 0.5 },
    ]

    const elParts = EL.map(el => {
      const arr = []
      for (let i = 0; i < 22; i++) {
        arr.push({
          a: el.startA + (Math.random() - .5) * 1.4,
          r: 50 + Math.random() * 28,
          speed: (.006 + Math.random() * .012) * (Math.random() > .5 ? 1 : -1),
          size: 1.2 + Math.random() * 2.4,
          op: .35 + Math.random() * .65,
          drift: Math.random() * Math.PI * 2,
          ds: .018 + Math.random() * .03,
        })
      }
      return arr
    })

    const mParts = []
    for (let i = 0; i < 50; i++) {
      mParts.push({
        a: Math.random() * Math.PI * 2,
        r: 32 + Math.random() * 30,
        speed: (.004 + Math.random() * .016) * (Math.random() > .5 ? 1 : -1),
        size: .7 + Math.random() * 2,
        ci: Math.floor(Math.random() * 4),
        op: .2 + Math.random() * .7,
        drift: Math.random() * Math.PI * 2,
        ds: .012 + Math.random() * .025,
      })
    }

    const easeInOut = x => x < .5 ? 4*x*x*x : 1 - Math.pow(-2*x+2,3)/2
    const lerp = (a,b,t) => a + (b-a)*t
    const clamp = (v,mn,mx) => Math.max(mn, Math.min(mx, v))

    let startTime = null
    let rafId = null
    let btnTriggered = false

    function draw(ts) {
      if (!startTime) startTime = ts
      const elapsed = ts - startTime
      const t = elapsed * .001

      ctx.clearRect(0, 0, W, H)

      const mp = easeInOut(clamp((elapsed - 2000) / 2500, 0, 1))
      const orbP = easeInOut(clamp((elapsed - 4500) / 500, 0, 1))
      const orbitP = clamp(elapsed / 2000, 0, 1)

      // bg pulse
      const pulse = .5 + Math.sin(t * 1.2) * .5
      const bg = ctx.createRadialGradient(CX,CY,0,CX,CY,100)
      bg.addColorStop(0, `rgba(60,20,130,${.04+pulse*.03})`)
      bg.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath(); ctx.arc(CX,CY,100,0,Math.PI*2); ctx.fillStyle=bg; ctx.fill()

      // element clusters
      EL.forEach((el, ei) => {
        const parts = elParts[ei]
        const orbitR = 72 * (1 - mp * .92)
        const speed = t * .14 + mp * .5
        const cX = CX + Math.cos(el.startA + speed) * orbitR
        const cY = CY + Math.sin(el.startA + speed) * orbitR
        const alpha = 1 - mp * .95
        if (alpha < .01) return

        if (mp > .05) {
          ctx.beginPath(); ctx.moveTo(cX,cY); ctx.lineTo(CX,CY)
          ctx.strokeStyle = el.col + Math.floor(mp*.18*255).toString(16).padStart(2,'0')
          ctx.lineWidth = 1; ctx.stroke()
        }

        parts.forEach(p => {
          p.a += p.speed * (1 + mp * .5); p.drift += p.ds
          const pr = p.r * (1 - mp * .75)
          const px = cX + Math.cos(p.a) * pr * .38
          const py = cY + Math.sin(p.a) * pr * .38 + Math.sin(p.drift) * 3
          const a2 = p.op * alpha
          ctx.beginPath(); ctx.arc(px,py, p.size*(1-mp*.6), 0, Math.PI*2)
          ctx.fillStyle = el.col + Math.floor(a2*255).toString(16).padStart(2,'0')
          ctx.fill()
        })

        // orbit trail
        ctx.beginPath()
        for (let a = 0; a < .8; a += .05) {
          const ox = CX + Math.cos(el.startA+speed-a)*orbitR
          const oy = CY + Math.sin(el.startA+speed-a)*orbitR
          if (a === 0) ctx.moveTo(ox,oy); else ctx.lineTo(ox,oy)
        }
        ctx.strokeStyle = el.col + Math.floor(alpha*.12*255).toString(16).padStart(2,'0')
        ctx.lineWidth = 1; ctx.stroke()

        const cr = 16 * (1 - mp * .85)
        const cg = ctx.createRadialGradient(cX,cY,0,cX,cY,cr*2.8)
        cg.addColorStop(0, el.gl+(alpha*.65)+')')
        cg.addColorStop(1, el.gl+'0)')
        ctx.beginPath(); ctx.arc(cX,cY,cr*2.8,0,Math.PI*2); ctx.fillStyle=cg; ctx.fill()
        ctx.beginPath(); ctx.arc(cX,cY,cr,0,Math.PI*2)
        ctx.fillStyle = el.col + Math.floor(alpha*.9*255).toString(16).padStart(2,'0'); ctx.fill()

        const symAlpha = clamp(orbitP*2,0,1) * (1 - mp*1.4)
        if (symAlpha > .01) {
          ctx.save(); ctx.globalAlpha = symAlpha
          ctx.font = '14px serif'; ctx.textAlign='center'; ctx.textBaseline='middle'
          ctx.fillText(['🔥','💧','🌿','🌪️'][ei], cX, cY-cr-10)
          ctx.restore()
        }
      })

      // merged orb
      if (mp > .05 || orbP > 0) {
        const orbR = lerp(8, 40, mp) + orbP * 2
        const orbAlpha = mp

        EL.forEach((el,i) => {
          const ga = Math.sin(t*.6+i*Math.PI*.5)*.5+.5
          const gr = ctx.createRadialGradient(CX,CY,0,CX,CY,orbR*1.9)
          gr.addColorStop(0, el.gl+(orbAlpha*.1*ga)+')')
          gr.addColorStop(1, el.gl+'0)')
          ctx.beginPath(); ctx.arc(CX,CY,orbR*1.9,0,Math.PI*2); ctx.fillStyle=gr; ctx.fill()
        })

        mParts.forEach(p => {
          p.a += p.speed; p.drift += p.ds
          const pr = p.r * mp
          const px = CX + Math.cos(p.a) * pr
          const py = CY + Math.sin(p.a) * pr + Math.sin(p.drift)*2
          ctx.beginPath(); ctx.arc(px,py, p.size*mp, 0, Math.PI*2)
          ctx.fillStyle = EL[p.ci].col + Math.floor(p.op*mp*220).toString(16).padStart(2,'0')
          ctx.fill()
        })

        EL.forEach((el,i) => {
          const dotA = i*Math.PI*.5 + t*.4
          const dotR = orbR*.78
          const dx = CX + Math.cos(dotA)*dotR
          const dy = CY + Math.sin(dotA)*dotR
          for (let tr=1; tr<=6; tr++) {
            const ta = dotA - tr*.09
            const tx = CX+Math.cos(ta)*dotR, ty2 = CY+Math.sin(ta)*dotR
            ctx.beginPath(); ctx.arc(tx,ty2, 2.5*(1-tr*.13)*mp, 0, Math.PI*2)
            ctx.fillStyle = el.col+Math.floor((1-tr*.14)*orbAlpha*90).toString(16).padStart(2,'0'); ctx.fill()
          }
          const dg = ctx.createRadialGradient(dx,dy,0,dx,dy,9*mp)
          dg.addColorStop(0, el.gl+(orbAlpha*.7)+')'); dg.addColorStop(1, el.gl+'0)')
          ctx.beginPath(); ctx.arc(dx,dy,9*mp,0,Math.PI*2); ctx.fillStyle=dg; ctx.fill()
          ctx.beginPath(); ctx.arc(dx,dy,3.5*mp,0,Math.PI*2); ctx.fillStyle=el.col; ctx.fill()
        })

        ctx.save(); ctx.translate(CX,CY); ctx.rotate(-t*.18)
        ctx.beginPath(); ctx.arc(0,0,orbR+12,0,Math.PI*2)
        ctx.strokeStyle = `rgba(167,139,250,${orbAlpha*.18})`
        ctx.lineWidth=1; ctx.setLineDash([4,9]); ctx.stroke()
        ctx.setLineDash([]); ctx.restore()

        const ob = ctx.createRadialGradient(CX-9,CY-9,1,CX,CY,orbR)
        ob.addColorStop(0,'rgba(200,185,255,.9)')
        ob.addColorStop(.3,'rgba(120,80,210,.75)')
        ob.addColorStop(.65,'rgba(20,10,50,.8)')
        ob.addColorStop(1,'rgba(5,3,14,.92)')
        ctx.beginPath(); ctx.arc(CX,CY,orbR,0,Math.PI*2)
        ctx.globalAlpha = orbAlpha; ctx.fillStyle = ob; ctx.fill(); ctx.globalAlpha = 1

        const hg = ctx.createRadialGradient(CX-10,CY-11,0,CX-5,CY-7,orbR*.7)
        hg.addColorStop(0,`rgba(255,255,255,${orbAlpha*.22})`)
        hg.addColorStop(1,'rgba(255,255,255,0)')
        ctx.beginPath(); ctx.arc(CX,CY,orbR,0,Math.PI*2); ctx.fillStyle=hg; ctx.fill()

        ctx.beginPath(); ctx.arc(CX,CY,orbR,0,Math.PI*2)
        ctx.strokeStyle=`rgba(167,139,250,${orbAlpha*.3})`; ctx.lineWidth=1; ctx.stroke()

        const moonA = clamp((mp-.45)*2,0,1)
        if (moonA > .02) {
          ctx.save(); ctx.globalAlpha = moonA
          ctx.font = `${orbR*.75}px serif`
          ctx.textAlign='center'; ctx.textBaseline='middle'
          ctx.fillText('🌙', CX, CY+2); ctx.restore()
        }
      }

      if (elapsed >= 5000 && !btnTriggered) {
        btnTriggered = true
        setBtnVisible(true)
      }

      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:999,
      background:'linear-gradient(180deg,#05030E 0%,#080518 100%)',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      overflow:'hidden',
    }}>
      {/* Stars */}
      <Stars />

      {/* Nebula */}
      <div style={{position:'absolute',width:350,height:350,top:-120,left:-80,borderRadius:'50%',background:'radial-gradient(circle,rgba(107,70,193,.18),transparent)',filter:'blur(60px)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',width:250,height:250,bottom:-70,right:-60,borderRadius:'50%',background:'radial-gradient(circle,rgba(190,24,93,.1),transparent)',filter:'blur(60px)',pointerEvents:'none'}}/>

      {/* Canvas */}
      <canvas ref={cvRef} width={240} height={240} style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-54%)',zIndex:2}}/>

      {/* Title */}
      <div style={{position:'absolute',bottom:148,textAlign:'center',zIndex:3,width:'100%',display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:28,fontWeight:700,letterSpacing:'.15em',background:'linear-gradient(135deg,#C4B5FD 0%,#A78BFA 35%,#FCD34D 70%,#F9A8D4 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',animation:'rise .9s cubic-bezier(.34,1.56,.64,1) .3s both'}}>
          LUNARA
        </div>
        <div style={{fontFamily:"'Inter',sans-serif",fontSize:10,letterSpacing:'.22em',textTransform:'uppercase',color:'rgba(245,243,255,.25)',fontWeight:300,animation:'rise .9s cubic-bezier(.34,1.56,.64,1) .6s both'}}>
          Your Cosmic Companion
        </div>
      </div>

      {/* Button */}
      <div style={{position:'absolute',bottom:42,width:264,zIndex:10}}>
        <button
          onClick={onEnter}
          style={{
            width:'100%', padding:'15px 0', borderRadius:50, border:'none',
            cursor:'pointer', position:'relative', overflow:'hidden',
            background:'transparent', outline:'none',
            opacity: btnVisible ? 1 : 0,
            transform: btnVisible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(.88)',
            transition:'opacity .8s cubic-bezier(.34,1.56,.64,1), transform .8s cubic-bezier(.34,1.56,.64,1)',
          }}
        >
          {/* Glow */}
          <div style={{position:'absolute',inset:-4,borderRadius:54,zIndex:0,background:'linear-gradient(135deg,rgba(239,68,68,.28),rgba(59,130,246,.28),rgba(16,185,129,.28),rgba(139,92,246,.28))',filter:'blur(10px)',animation:'gpulse 2.8s ease-in-out infinite'}}/>
          {/* BG */}
          <div style={{position:'absolute',inset:0,borderRadius:50,background:'linear-gradient(135deg,rgba(88,40,190,.95),rgba(120,60,220,.9),rgba(88,40,190,.95))'}}/>
          {/* Border */}
          <div style={{position:'absolute',inset:0,borderRadius:50,border:'1px solid rgba(167,139,250,.4)',pointerEvents:'none'}}/>
          {/* Element dots */}
          {[
            {side:'left', pos:18,  col:'#EF4444', delay:'0s'},
            {side:'left', pos:34,  col:'#3B82F6', delay:'.5s'},
            {side:'right',pos:34,  col:'#10B981', delay:'.25s'},
            {side:'right',pos:18,  col:'#A78BFA', delay:'.75s'},
          ].map((d,i)=>(
            <div key={i} style={{
              position:'absolute', width:5, height:5, borderRadius:'50%',
              top:'50%', transform:'translateY(-50%)',
              [d.side]: d.pos, background: d.col,
              boxShadow:`0 0 7px ${d.col}`,
              animation:`blink 2s ease-in-out ${d.delay} infinite`,
            }}/>
          ))}
          {/* Label */}
          <div style={{position:'relative',zIndex:2,fontFamily:"'Cinzel',serif",fontSize:13,fontWeight:600,letterSpacing:'.22em',color:'#F5F3FF',display:'flex',alignItems:'center',justifyContent:'center',gap:10,textShadow:'0 0 18px rgba(196,181,253,.5)'}}>
            <span style={{fontSize:10,opacity:.65,animation:'bspin 5s linear infinite'}}>✦</span>
            შესვლა
            <span style={{fontSize:10,opacity:.65,animation:'bspin 5s linear infinite'}}>✦</span>
          </div>
        </button>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400&display=swap');
        @keyframes rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes gpulse{0%,100%{opacity:.45;transform:scale(1)}50%{opacity:.85;transform:scale(1.05)}}
        @keyframes blink{0%,100%{opacity:.4;transform:translateY(-50%) scale(.75)}50%{opacity:1;transform:translateY(-50%) scale(1.2)}}
        @keyframes bspin{to{transform:rotate(360deg)}}
      `}</style>
    </div>
  )
}

function Stars() {
  return (
    <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:0}}>
      {Array.from({length:65}).map((_,i)=>{
        const z = .3+Math.random()*1.6
        const top = Math.random()*100
        const left = Math.random()*100
        const dur = 2+Math.random()*5
        const del = Math.random()*5
        const op = .1+Math.random()*.5
        return (
          <div key={i} style={{
            position:'absolute', borderRadius:'50%', background:'#fff',
            width:z, height:z, top:`${top}%`, left:`${left}%`,
            animation:`twkS ${dur}s ${del}s ease-in-out infinite alternate`,
            ['--op']: op,
          }}/>
        )
      })}
      <style>{`@keyframes twkS{from{opacity:.03;transform:scale(.5)}to{opacity:.5;transform:scale(1.3)}}`}</style>
    </div>
  )
}