
#ifdef GL_ES
precision mediump float;
#endif






// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}






//	Simplex 3D Noise 
//	by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}











uniform vec2 u_resolution;
uniform float u_time;

varying vec3 vUv;




void main() {

    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    // Scale the coordinate system to see
    // some noise in action
    vec2 pos = vec2(st * 1.0);

    // Use the noise function
    float n = snoise(vec3(pos.xy, u_time / 10.0));


    float c1 = 1.0;
    float c2 = 0.0;


    // if(n > 0.0 && n < 0.05) n = smoothstep(0.0, 0.05, n);
    // else if(n > 0.1 && n < 0.15) n = smoothstep(0.1, 0.15, n);
    // else if(n > 0.2 && n < 0.25) n = smoothstep(0.2, 0.25, n);
    // else if(n > 0.3 && n < 0.35) n = smoothstep(0.3, 0.35, n);
    // else if(n > 0.4 && n < 0.45) n = smoothstep(0.4, 0.45, n);
    // else if(n > 0.5 && n < 0.55) n = smoothstep(0.5, 0.55, n);
    // else if(n > 0.6 && n < 0.65) n = smoothstep(0.6, 0.65, n);
    // else if(n > 0.7 && n < 0.75) n = smoothstep(0.7, 0.75, n);
    // else if(n > 0.8 && n < 0.85) n = smoothstep(0.8, 0.85, n);
    // else if(n > 0.9 && n < 0.95) n = smoothstep(0.9, 0.95, n);
    
    // else if(n > 0.5) n = c2;
    // else n = c2;



    if(n > 0.0 && n < 0.1) n = smoothstep(0.0, 0.1, n);
    else if(n > 0.1 && n < 0.2) n = smoothstep(0.1, 0.2, n);
    else if(n > 0.2 && n < 0.3) n = smoothstep(0.2, 0.3, n);
    else if(n > 0.3 && n < 0.4) n = smoothstep(0.3, 0.4, n);
    else if(n > 0.4 && n < 0.5) n = smoothstep(0.4, 0.5, n);
    else if(n > 0.5 && n < 0.6) n = smoothstep(0.5, 0.6, n);
    else if(n > 0.6 && n < 0.7) n = smoothstep(0.6, 0.7, n);
    else if(n > 0.7 && n < 0.8) n = smoothstep(0.7, 0.8, n);
    else if(n > 0.8 && n < 0.9) n = smoothstep(0.8, 0.9, n);
    else if(n > 0.9 && n < 1.0) n = smoothstep(0.9, 1.0, n);

    else if(n > 0.5) n = c2;
    else n = c2;




    vec3 color = vec3(1.0);

    gl_FragColor = vec4(color * n, 1.0);
}
