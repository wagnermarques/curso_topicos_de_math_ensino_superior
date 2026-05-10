import bpy
import os

# Limpa a cena inicial
bpy.ops.wm.read_factory_settings(use_empty=True)

# 1. Cria o Chão (Estádio)
bpy.ops.mesh.primitive_plane_add(size=100, location=(0, 0, 0))
ground = bpy.context.object
ground.name = "Ground"

# 2. Cria o Canhão (Lançador)
bpy.ops.mesh.primitive_cylinder_add(radius=1, depth=4, location=(0, 0, 2))
cannon = bpy.context.object
cannon.name = "Cannon"
cannon.rotation_euler[1] = 0.785398 # 45 graus

# 3. Cria um Alvo (Target)
bpy.ops.mesh.primitive_uv_sphere_add(radius=2, location=(40, 0, 0))
target = bpy.context.object
target.name = "Target"
# Material Vermelho para o Alvo
mat = bpy.data.materials.new(name="TargetMaterial")
mat.use_nodes = True
nodes = mat.node_tree.nodes
nodes["Principled BSDF"].inputs[0].default_value = (1, 0, 0, 1) # Vermelho
target.data.materials.append(mat)

# 4. Adiciona Iluminação
bpy.ops.object.light_add(type='SUN', location=(10, 10, 20))

# 5. Salva o arquivo .blend
output_path = os.path.join(os.getcwd(), "assets", "stadium.blend")
bpy.ops.wm.save_as_mainfile(filepath=output_path)
print(f"Arquivo .blend salvo em: {output_path}")

# 6. Exporta para .glb (para usar no WebGL)
glb_path = os.path.join(os.getcwd(), "assets", "stadium.glb")
bpy.ops.export_scene.gltf(filepath=glb_path, export_format='GLB')
print(f"Arquivo .glb exportado para: {glb_path}")
