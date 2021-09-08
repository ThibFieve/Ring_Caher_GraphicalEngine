//3D cube vertex coordinates and indices
var textvertices = 
[ // X, Y, Z          
  //Top
  -1.0, 1.0, -1.0,   
  -1.0, 1.0, 1.0,    
  1.0, 1.0, 1.0,     
  1.0, 1.0, -1.0,    
  //
  -1.0, 1.0, 1.0,    
  -1.0, -1.0, 1.0,   
  -1.0, -1.0, -1.0,  
  -1.0, 1.0, -1.0,   
  // 
  1.0, 1.0, 1.0,    
  1.0, -1.0, 1.0,   
  1.0, -1.0, -1.0,  
  1.0, 1.0, -1.0,   
  // 
  1.0, 1.0, 1.0,    
  1.0, -1.0, 1.0,    
  -1.0, -1.0, 1.0,    
  -1.0, 1.0, 1.0,    
  //
  1.0, 1.0, -1.0,    
  1.0, -1.0, -1.0,    
  -1.0, -1.0, -1.0,    
  -1.0, 1.0, -1.0,    
  // B
  -1.0, -1.0, -1.0,   
  -1.0, -1.0, 1.0,    
  1.0, -1.0, 1.0,     
  1.0, -1.0, -1.0  
];

var textindices =
[
  // Top
  0, 1, 2,
  0, 2, 3,

  // Left
  5, 4, 6,
  6, 4, 7,

  // Right
  8, 9, 10,
  8, 10, 11,

  // Front
  13, 12, 14,
  15, 14, 12,

  // Back
  16, 17, 18,
  16, 18, 19,

  // Bottom
  21, 20, 22,
  22, 20, 23
];

var textuv =
[
  // Top
  0, 0,
  0, 1,
  1, 1,
  1, 0,
  // Left
  0, 0,
  1, 0,
  1, 1,
  0, 1,
  // Right
  1, 1,
  0, 1,
  0, 0,
  1, 0,
  // Front
  1, 1,
  1, 0,
  0, 0,
  0, 1,
  // Back
  0, 0,
  0, 1,
  1, 1,
  1, 0,
  // Bottom
  1, 1,
  1, 0,
  0, 0,
  0, 1
];