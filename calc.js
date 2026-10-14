

function $(i){return +document.getElementById(i).value||0}
function W(n){return Math.round(n).toLocaleString("ko-KR")+"원"}
function R(i,h){document.getElementById(i).innerHTML=h}
function tbl(rows){return '<div class="wrap"><table>'+rows.map(function(r){return "<tr><td>"+r[0]+"</td><td>"+r[1]+"</td></tr>"}).join("")+"</table></div>"}

/* 요율 상수: 매년 갱신 필요 (기준일 확인) */
var NP=0.0475,NP_MAX=6370000,HI=0.03545,LTC=0.1314,EI=0.009;
function salary(){
 var y=$("s_y"),nt=$("s_n")*12,fam=$("s_f");
 var m=Math.max(y-nt,0)/12;
 var np=Math.floor(Math.min(m,NP_MAX)*NP/10)*10,hi=Math.floor(m*HI/10)*10,lt=Math.floor(hi*LTC/10)*10,ei=Math.floor(m*EI/10)*10;
 var ins=(np+hi+lt+ei)*12,tax=Math.max(y-nt,0);
 var d=tax<=5e6?tax*.7:tax<=15e6?3.5e6+(tax-5e6)*.4:tax<=45e6?7.5e6+(tax-15e6)*.15:tax<=100e6?12e6+(tax-45e6)*.05:14.75e6+(tax-100e6)*.02;
 d=Math.min(d,2e7);
 var base=Math.max(tax-d-1.5e6*(1+fam)-(np+hi+lt)*12-ei*12,0);
 var B=[[14e6,.06,0],[50e6,.15,1.26e6],[88e6,.24,5.76e6],[150e6,.35,15.44e6],[300e6,.38,19.94e6],[500e6,.4,25.94e6],[1e9,.42,35.94e6],[1e18,.45,65.94e6]],it=0;
 for(var i=0;i<B.length;i++){if(base<=B[i][0]){it=base*B[i][1]-B[i][2];break}}
 var cr=it<=1.3e6?it*.55:715000+(it-1.3e6)*.3,cap=tax<=33e6?740000:tax<=70e6?Math.max(660000-(tax-33e6)*.008,500000):Math.max(500000-(tax-70e6)*.5/100,200000);
 it=Math.max(it-Math.min(cr,cap),0);
 var mi=Math.floor(it/12/10)*10,ml=Math.floor(mi*.1/10)*10,ded=np+hi+lt+ei+mi+ml,mm=y/12;
 R("s_r",'월 실수령액 <div class="big">'+W(mm-ded)+'</div>'+tbl([["월 급여(세전)",W(mm)],["국민연금",W(np)],["건강보험",W(hi)],["장기요양",W(lt)],["고용보험",W(ei)],["근로소득세",W(mi)],["지방소득세",W(ml)],["공제 합계",W(ded)]]))}

function loan(){
 var P=$("l_p"),r=$("l_r")/1200,n=$("l_m"),t=document.getElementById("l_t").value,tot=0,f=0;
 if(!P||!n){return R("l_r2","원금과 기간을 입력하세요.")}
 if(t=="a"){var m=r?P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):P/n;f=m;tot=m*n-P;
  R("l_r2",'월 상환액 <div class="big">'+W(m)+'</div>'+tbl([["총 이자",W(tot)],["총 상환액",W(P+tot)]]))}
 else if(t=="b"){var pr=P/n,b=P,l=0;f=pr+P*r;for(var i=0;i<n;i++){tot+=b*r;l=pr+b*r;b-=pr}
  R("l_r2",'첫 달 상환액 <div class="big">'+W(f)+'</div>'+tbl([["마지막 달 상환액",W(l)],["총 이자",W(tot)],["총 상환액",W(P+tot)]]))}
 else{tot=P*r*n;R("l_r2",'월 이자 <div class="big">'+W(P*r)+'</div>'+tbl([["총 이자",W(tot)],["만기 원금",W(P)]]))}}

function save(){
 var t=document.getElementById("d_t").value,a=$("d_a"),r=$("d_r")/100,n=$("d_m"),c=document.getElementById("d_c").value,x=+document.getElementById("d_x").value,pr,it;
 if(t=="d"){pr=a;it=c=="s"?a*r*n/12:a*(Math.pow(1+r/12,n)-1)}
 else{pr=a*n;if(c=="s"){it=a*r/12*n*(n+1)/2}else{it=0;for(var i=1;i<=n;i++)it+=a*Math.pow(1+r/12,n-i+1)-a}}
 var tx=it*x;R("d_res",'세후 수령액 <div class="big">'+W(pr+it-tx)+'</div>'+tbl([["납입 원금",W(pr)],["세전 이자",W(it)],["이자세금",W(tx)],["세후 이자",W(it-tx)]]))}

function sev(){
 var s=new Date(document.getElementById("t_s").value),e=new Date(document.getElementById("t_e").value),days=Math.round((e-s)/864e5)+1;
 if(!(days>0)){return R("t_r","날짜를 확인하세요.")}
 if(days<365){return R("t_r","재직기간이 1년 미만이면 법정 퇴직금 지급 대상이 아닙니다. (재직 "+days+"일)")}
 var d=$("t_d")||92,avg=($("t_p")+$("t_b")*3/12+$("t_v")*3/12)/d,sv=avg*30*days/365;
 R("t_r",'예상 퇴직금(세전) <div class="big">'+W(sv)+'</div>'+tbl([["재직일수",days.toLocaleString()+"일"],["1일 평균임금",W(avg)]]))}

function rent(){
 var j=$("r_j"),d=$("r_d"),r=$("r_r")/100,w=$("r_w");
 if(!r){return R("r_res","전환율을 입력하세요.")}
 R("r_res",'전세→월세: 월세 <div class="big">'+W(Math.max(j-d,0)*r/12)+'</div>'+tbl([["월세→전세 환산 전세금",W(w*12/r+d)]]))}

function btax(b){var B=[[14e6,.06,0],[50e6,.15,1.26e6],[88e6,.24,5.76e6],[150e6,.35,15.44e6],[300e6,.38,19.94e6],[500e6,.4,25.94e6],[1e9,.42,35.94e6],[1e18,.45,65.94e6]];for(var i=0;i<B.length;i++)if(b<=B[i][0])return Math.max(b*B[i][1]-B[i][2],0);return 0}
function cg(){var sp=$("c_s"),g=sp-$("c_b")-$("c_e"),h=$("c_h"),l=$("c_l"),o=document.getElementById("c_o").value;
 if(g<=0)return R("c_res","양도차익이 없어 양도소득세가 없습니다.");
 var tg=g,ltd;
 if(o=="1"){if(h<2)return R("c_res","보유 2년 미만이면 비과세 요건 미충족입니다. 일반 과세를 선택하세요.");
  if(sp<=12e8)return R("c_res",'<div class="big">비과세</div><p>양도가 12억원 이하 1세대 1주택 비과세로 가정했습니다.</p>');
  tg=g*(sp-12e8)/sp;ltd=(h>=3?Math.min(h,10)*4:0)+(l>=2?Math.min(l,10)*4:0)}
 else ltd=h>=3?(h>=15?30:6+(h-3)*2):0;
 var base=Math.max(tg*(1-ltd/100)-2.5e6,0),t=h<1?base*.7:h<2?base*.6:btax(base),lc=t*.1;
 R("c_res",'납부세액 합계 <div class="big">'+W(t+lc)+'</div>'+tbl([["양도차익",W(g)],["과세 대상 양도차익",W(tg)],["장기보유특별공제율",ltd+"%"],["과세표준(기본공제 250만원 후)",W(base)],["양도소득세",W(t)],["지방소득세",W(lc)]]))}
function itx(){var n=Math.max($("i_n"),1),inc=Math.max($("i_r")-$("i_e"),0),base=Math.max(inc-1.5e6*n-$("i_d"),0),t=Math.max(btax(base)-$("i_c"),0),lc=Math.floor(t*.1/10)*10,tot=t+lc,df=tot-$("i_p");
 R("i_res",'총 결정세액 <div class="big">'+W(tot)+'</div>'+tbl([["종합소득금액",W(inc)],["과세표준",W(base)],["소득세",W(t)],["지방소득세",W(lc)],[df>=0?"추가 납부액":"환급액",W(Math.abs(df))]]))}

function pm(P,r,n){return r?P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):P/n}
function dsr(){var inc=$("g_i"),old=$("g_o"),P=$("g_p"),r=($("g_r")+$("g_s"))/1200,n=$("g_m");
 if(!inc||!n){return R("g_res","소득과 기간을 입력하세요.")}
 var na=pm(P,r,n)*12,v=(old+na)/inc*100,room=Math.max(inc*.4-old,0),mx=room/12/(pm(1,r,n));
 R("g_res",'DSR <div class="big">'+v.toFixed(1)+'%</div>'+tbl([["신규 대출 연 원리금",W(na)],["기존 대출 연 원리금",W(old)],["40% 기준 신규 대출 한도(추정)",W(mx)]])+(v>40?'<p>은행권 40% 기준을 초과합니다.</p>':'<p>은행권 40% 기준 이내입니다.</p>'))}
function acq(){var p=$("a_p"),a=document.getElementById("a_a").value,
 rt=p<=6e8?.01:p<=9e8?(p/1e8*2/3-3)/100:.03,t=p*rt,ed=t*.1,fm=a=="b"?p*.002:0;
 R("a_res",'취득세 합계 <div class="big">'+W(t+ed+fm)+'</div>'+tbl([["적용 취득세율",(rt*100).toFixed(2)+"%"],["취득세",W(t)],["지방교육세",W(ed)],["농어촌특별세",W(fm)]]))}
