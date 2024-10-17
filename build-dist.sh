mkdir ./dist/esm
cat >dist/esm/index.js <<!EOF
import cjsModule from "../index.js";
export const exportActorProfile = cjsModule.exportActorProfile;
!EOF

cat >dist/esm/package.json <<!EOF
{
  "type": "module"
}
!EOF
